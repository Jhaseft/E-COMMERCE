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

        $orderItems = [];
        foreach ($request->cart as $item) {
            $orderItems[] = OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['id'],
                'quantity' => $item['quantity'],
                'price' => round($item['price'], 2),
                'subtotal' => round($item['quantity'] * $item['price'], 2),
            ]);
        }

        // WhatsApp
        try {
            $mensaje = "📌 *Nuevo pedido realizado*\n";
            foreach ($orderItems as $item) {
                $mensaje .= "• {$item->product->name} x {$item->quantity} = Bs. ".number_format($item->subtotal, 2)."\n";
            }
            $mensaje .= "💵 Total: Bs. ".number_format($order->total, 2)."\n";
            $mensaje .= "🔗 Ver detalles en admin: ".url('/admin/login');

            Http::withHeaders([
                'Content-Type' => 'application/json',
                'apikey' => 'TU_APIKEY',
            ])->post("https://automatizando-evolution-api-last.pk1ooa.easypanel.host/message/sendText/Prueba", [
                'number' => '59174048209',
                'text' => $mensaje,
            ]);
        } catch (\Exception $e) {
            Log::error("Error enviando WhatsApp: ".$e->getMessage());
        }

        // Vaciar carrito
        Cart::destroy();

        // ✅ DEVOLVER JSON de éxito
        return response()->json([
            'success' => true,
            'message' => 'Tu pedido se realizó con éxito!',
        ]);

    } catch (\Exception $e) {
        Log::error("Error creando pedido: ".$e->getMessage());

        // ❌ DEVOLVER JSON de error
        return response()->json([
            'success' => false,
            'message' => 'Error al crear el pedido: '.$e->getMessage()
        ], 500);
    }
}

}
