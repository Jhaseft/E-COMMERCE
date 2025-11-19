<h1>Orden Entregada: #{{ $order->id }}</h1>
<p>Cliente: {{ $order->user->name }} ({{ $order->user->email }})</p>
<p>Productos:</p>
<ul>
@foreach($order->items as $item)
    <li>{{ $item->product->name }} - Cantidad: {{ $item->quantity }} - Stock actual: {{ $item->product->stock }}</li>
@endforeach
</ul>
<p>Total: Bs{{ number_format($order->total, 2) }}</p>
