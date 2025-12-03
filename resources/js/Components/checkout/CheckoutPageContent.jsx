'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/Contexts/CartContext';
import CheckoutHeader from './CheckoutHeader';
import CustomerInfoForm from './CustomerInfo'; // Formulario editable
import CartItems from './CartItems';
import ShippingForm from './ShippingForm';
import OrderSummary from './OrderSummary';
import Layout from '@/Layouts/LayoutCheckout';
import { Head, router } from '@inertiajs/react';

export default function CheckoutPageContent() {
    const { cart = [], subtotal = 0, total = 0 } = useCart();
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    // Datos del cliente
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');

    const [shippingType, setShippingType] = useState("local");
    const [date, setDate] = useState(null);
    const [time, setTime] = useState("");
    const [address, setAddress] = useState("Recojo en el local");

    useEffect(() => {
        if (cart.length > 0) setLoading(false);
    }, [cart]);

    const handlePlaceOrder = () => {
        // Validaciones
        if (!customerName.trim() || !customerPhone.trim()) {
            alert("Debes ingresar tu nombre y número de teléfono.");
            return;
        }

        if (shippingType === "envio") {
            if (!address.trim()) {
                alert("Debes ingresar una dirección para el envío a domicilio.");
                return;
            }
            if (!date) {
                alert("Debes seleccionar una fecha de entrega.");
                return;
            }
            if (!time) {
                alert("Debes seleccionar una hora de entrega.");
                return;
            }
        }

        setProcessing(true);

        const orderItems = cart.map(item => ({
            id: item.id,
            quantity: item.qty,
            price: item.price,
            subtotal: item.price * item.qty
        }));

        // Enviar pedido al backend
        router.post('/orders/store', {
            customer_name: customerName,
            customer_phone: customerPhone,
            shipping_type: shippingType,
            delivery_date: date,
            delivery_time: time,
            address,
            cart: orderItems,
            subtotal,
            total,
        }, {
            onError: (errors) => {
                console.error("Error al crear pedido: ", errors);
                setProcessing(false);
            },
            onSuccess: () => {
                setProcessing(false);
            }
        });
    };

    return (
        <Layout title="Checkout">
            <Head title="Checkout" />
            <div className="max-w-2xl mx-auto p-4 text-white">
                <CheckoutHeader />

                <CustomerInfoForm
                    customerName={customerName}
                    setCustomerName={setCustomerName}
                    customerPhone={customerPhone}
                    setCustomerPhone={setCustomerPhone}
                />

                <CartItems cart={cart} loading={loading} />

                <ShippingForm
                    shippingType={shippingType}
                    setShippingType={(type) => {
                        setShippingType(type);
                        setAddress(type === "local" ? "Recojo en el local" : "");
                    }}
                    date={date} setDate={setDate}
                    time={time} setTime={setTime}
                    address={address} setAddress={setAddress}
                />

                <OrderSummary cart={cart} subtotal={subtotal} total={total} loading={loading} />

                <button
                    className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded flex justify-center items-center ${
                        (loading || processing) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={handlePlaceOrder}
                    disabled={loading || processing}
                >
                    {processing ? (
                        <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                    ) : null}
                    {processing ? "Procesando..." : "Realizar Pedido"}
                </button>
            </div>
        </Layout>
    );
}
