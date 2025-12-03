<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\OrderItem;
use Cart;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Mail\OrderConfirmation;

class PedidosController extends Controller
{
    public function index()
    {
        return Inertia::render('checkout');
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'shipping_type' => 'required|in:local,envio',
            'delivery_date' => 'required|date',
            'delivery_time' => 'required|string',
            'address' => 'required|string',
            'cart' => 'required|array|min:1',
            'cart.*.id' => 'required|exists:products,id',
            'cart.*.quantity' => 'required|integer|min:1',
            'cart.*.price' => 'required|numeric|min:0',
            'subtotal' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
        ]);

        try {
            // Crear pedido con datos del cliente
            $order = Order::create([
                'customer_name' => $request->customer_name,
                'customer_phone' => $request->customer_phone,
                'status_id' => 1,
                'payment_method_id' => $request->payment_method_id ?? 1,
                'total' => $request->total,
                'note' => $request->shipping_type === 'envio' ? $request->address : 'Recojo en el local',
                'delivery_date' => $request->delivery_date,
                'delivery_time' => $request->delivery_time,
            ]);

            // Crear items
            $orderItems = [];
            foreach ($request->cart as $item) {
                $orderItem = OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['id'],
                    'quantity' => $item['quantity'],
                    'price' => round($item['price'], 2),
                    'subtotal' => round($item['quantity'] * $item['price'], 2),
                ]);
                $orderItems[] = $orderItem;
            }

            // Enviar correo al cliente (opcional si tienes mail)
            // Puedes enviar al phone@gmail.com si quieres simular correo
            // Mail::to($order->customer_phone.'@temporal.local')->send(new OrderConfirmation($order, $orderItems));

            // 🔔 Enviar mensaje WhatsApp al admin con resumen del pedido
            try {
                $mensaje = "📌 *Nuevo pedido realizado*\n\n";
                $mensaje .= "🧑‍💼 Cliente: {$order->customer_name} ({$order->customer_phone})\n";
                $mensaje .= "📅 Fecha de entrega: {$order->delivery_date} a las {$order->delivery_time}\n";
                $mensaje .= "🏠 Dirección: {$order->note}\n";
                $mensaje .= "🛒 Productos:\n";

                foreach ($orderItems as $item) {
                    $mensaje .= "• {$item->product->name} x {$item->quantity} = Bs. ".number_format($item->subtotal, 2)."\n";
                }

                $mensaje .= "\n💵 Total: Bs. ".number_format($order->total, 2)."\n";
                $mensaje .= "🔗 Ver detalles en admin: ".url('/admin/login');

                $server   = "https://automatizando-evolution-api-last.pk1ooa.easypanel.host";
                $instance = "Prueba";
                $apikey   = "5D2EA457-D8C8-4B31-AAAE-2126007B9CD9";

                $whatsPayload = [
                    'number' => '59174048209', // número admin
                    'text'   => $mensaje,
                ];

                $response = Http::withHeaders([
                    'Content-Type' => 'application/json',
                    'apikey' => $apikey,
                ])->post("$server/message/sendText/$instance", $whatsPayload);

                if ($response->failed()) {
                    Log::error(" Error enviando mensaje de pedido al admin: ".$response->body());
                }

            } catch (\Exception $e) {
                Log::error(" Excepción enviando mensaje de pedido al admin: ".$e->getMessage());
            }

            // Vaciar carrito
            Cart::destroy();

            return redirect()->route('welcome')->with('success', 'Tu pedido se realizó con éxito!');

        } catch (\Exception $e) {
            return redirect()->route('checkout')->with('error', 'Error al crear el pedido: ' . $e->getMessage());
        }
    }
}
