<h1>Gracias por tu compra, {{ $order->user->name }}!</h1>
<p>Tu pedido #{{ $order->id }} ha sido entregado.</p>
<p>Resumen de tu pedido:</p>
<ul>
@foreach($order->items as $item)
    <li>{{ $item->product->name }} - Cantidad: {{ $item->quantity }}</li>
@endforeach
</ul>
<p>Total pagado: Bs{{ number_format($order->total, 2) }}</p>
<p>¡Esperamos verte pronto nuevamente!</p>
