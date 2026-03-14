// // import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
// // import { supabase } from "../supabaseClient";
// // import { useNavigate } from "react-router-dom";

// // export default function PaymentForm({ orderData }) {
// //   const stripe = useStripe();
// //   const elements = useElements();
// //   const navigate = useNavigate();

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     const { error, paymentIntent } = await stripe.confirmCardPayment(
// //       orderData.clientSecret,
// //       {
// //         payment_method: {
// //           card: elements.getElement(CardElement)
// //         }
// //       }
// //     );

// //     if (error) {
// //       alert(error.message);
// //       return;
// //     }

// //     if (paymentIntent.status === "succeeded") {

// //       /* 1️⃣ CREATE ORDER */
// //       const { data: order, error: orderErr } = await supabase
// //         .from("orders")
// //         .insert({
// //           user_id: orderData.address.user_id,
// //           address_id: orderData.address.id,
// //           total_amount: orderData.total,
// //           payment_method: "STRIPE",
// //           payment_status: "paid",
// //           status: "processing",
// //           stripe_payment_intent: paymentIntent.id
// //         })
// //         .select()
// //         .single();

// //       if (orderErr) {
// //         alert("Order creation failed");
// //         return;
// //       }

// //       /* 2️⃣ INSERT ORDER ITEMS */
// //       await supabase.from("order_items").insert(
// //         orderData.cartItems.map(item => ({
// //           order_id: order.id,
// //           product_id: item.product_id,
// //           variant_id: item.variant_id,
// //           qty: Number(item.quantity),
// //           unit_price: Number(item.price)
// //         }))
// //       );

// //       /* 3️⃣ REDUCE STOCK */
// //       await Promise.all(
// //         orderData.cartItems.map(item =>
// //           supabase.rpc("decrement_stock", {
// //             row_id: item.variant_id,
// //             count: Number(item.quantity)
// //           })
// //         )
// //       );

// //       /* 4️⃣ DONE */
// //       navigate("/order-success");
// //     }
// //   };

// //   return (
// //     <form onSubmit={handleSubmit}>
// //       <CardElement />
// //       <button className="mt-6 w-full bg-black text-white py-4 rounded">
// //         Pay Now
// //       </button>
// //     </form>
// //   );
// // }
// import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
// import { supabase } from "../supabaseClient";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { useCart } from "../hooks/useCart"; // Assuming you have this to clear cart

// export default function PaymentForm({ orderData }) {
//   const stripe = useStripe();
//   const elements = useElements();
//   const navigate = useNavigate();
//   const { clearCart } = useCart();
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!stripe || !elements) return;

//     setLoading(true);

//     const { error, paymentIntent } = await stripe.confirmPayment({
//       elements,
//       redirect: "if_required",
//     });

//     if (error) {
//       alert(error.message);
//       setLoading(false);
//       return;
//     }

//     if (paymentIntent.status === "succeeded") {
//       try {
//         /* 1️⃣ CREATE ORDER (Fixed for your Schema) */
//         const { data: order, error: orderErr } = await supabase
//           .from("orders")
//           .insert({
//             user_id: orderData.address.user_id,
//             address_id: orderData.address.id,
//             total_amount: Math.round(orderData.total), // Schema says INTEGER
//             payment_method: "STRIPE",
//             payment_status: "unpaid", // Initial state; payment record changes this
//             status: "processing",      // Matches your Enum default
//             shipping_phone: orderData.address.phone,
//             shipping_email: orderData.user_email // Optional: pass email if available
//           })
//           .select().single();

//         if (orderErr) throw orderErr;

//         /* 2️⃣ CREATE PAYMENT RECORD (Triggers your SQL 'mark_order_paid' function) */
//         const { error: payErr } = await supabase
//           .from("payments")
//           .insert({
//             order_id: order.id,
//             transaction_id: paymentIntent.id,
//             gateway: "stripe",
//             status: "success" // Ensure this matches your public.payment_status Enum
//           });

//         if (payErr) throw payErr;

//         /* 3️⃣ INSERT ORDER ITEMS */
//         const { error: itemsErr } = await supabase.from("order_items").insert(
//           orderData.cartItems.map(item => ({
//             order_id: order.id,
//             product_id: item.product_id,
//             variant_id: item.variant_id,
//             qty: Number(item.quantity),
//             unit_price: Number(item.price)
//           }))
//         );
//         if (itemsErr) throw itemsErr;

//         /* 4️⃣ REDUCE STOCK */
//         await Promise.all(
//           orderData.cartItems.map(item =>
//             supabase.rpc("decrement_stock", {
//               row_id: item.variant_id,
//               count: Number(item.quantity)
//             })
//           )
//         );

//         clearCart();
//         navigate("/order-success");
//       } catch (err) {
//         console.error(err);
//         alert("Payment successful, but database update failed. Please contact support.");
//       }
//     }
//     setLoading(false);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-md">
//       <PaymentElement /> 
//       <button 
//         disabled={loading || !stripe}
//         className="mt-6 w-full bg-black text-white py-4 rounded-xl font-bold disabled:bg-zinc-400"
//       >
//         {loading ? "Processing..." : `Pay ${orderData.total} PKR`}
//       </button>
//     </form>
//   );
// }