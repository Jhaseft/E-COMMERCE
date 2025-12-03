<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderDeliveredAdmin;
use App\Mail\OrderDeliveredCustomer;

class OrderController extends Controller
{
    /**
     * Listar todas las órdenes (JSON)
     */
    public function index(Request $request)
    {
        $query = Order::with(['status', 'paymentMethod']); // quitar 'user'

        // BÚSQUEDA REAL AGRUPADA
        if ($request->search) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('id', 'LIKE', "%$search%")
                  ->orWhere('customer_name', 'LIKE', "%$search%");
            });
        }

        // PAGINACIÓN REAL
        $orders = $query->orderByDesc('id')->paginate(7);

        return response()->json($orders);
    }

    /**
     * Mostrar detalle de una orden (JSON)
     */
    public function show(Order $order)
    {
        $order->load(['status', 'paymentMethod', 'items.product']); // quitar 'user'
        return response()->json($order);
    }

    /**
     * Actualizar una orden (JSON)
     */
    public function update(Request $request, Order $order)
    {
        $request->validate([
            'status_id'         => 'required|exists:order_statuses,id',
            'payment_method_id' => 'required|exists:payment_methods,id',
            'total'             => 'required|numeric|min:0',
            'note'              => 'nullable|string|max:500',
            'delivery_date'     => 'nullable|date',
            'delivery_time'     => 'nullable|string|max:10',
        ]);

        $previousStatus = $order->status_id;

        // Actualizar orden
        $order->update($request->only([
            'status_id', 'payment_method_id', 'total', 'note', 'delivery_date', 'delivery_time'
        ]));

        // Descontar stock si pasa a Completado (id=3) y antes no estaba completado
        if ($order->status_id == 3 && $previousStatus != 3) {
            foreach ($order->items as $item) {
                $product = $item->product;
                $product->stock = max(0, $product->stock - $item->quantity);
                $product->save();
            }
        }

        // Enviar correos si pasa a Entregado (id=4) y antes no estaba entregado
        if ($order->status_id == 4 && $previousStatus != 4) {
            Mail::to('jhasesaat@gmail.com')->send(new OrderDeliveredAdmin($order));

            // Solo enviar al cliente si tienes email en la tabla orders
            if (!empty($order->customer_email)) {
                Mail::to($order->customer_email)->send(new OrderDeliveredCustomer($order));
            }
        }

        return response()->json([
            'success' => true,
            'order'   => $order,
        ]);
    }

    /**
     * Eliminar una orden (JSON)
     */
    public function destroy(Order $order)
    {
        $order->delete();
        return response()->json(['success' => true]);
    }

    /**
     * Para ver los estados y métodos de pago
     */
    public function meta()
    {
        $statuses = \App\Models\OrderStatus::all();
        $payments = \App\Models\PaymentMethod::all();

        return response()->json([
            'statuses' => $statuses,
            'payments' => $payments,
        ]);
    }
}
