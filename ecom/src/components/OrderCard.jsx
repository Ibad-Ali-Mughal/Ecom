import { formatPKR } from '../utils/formatPrice';

export default function OrderCard({ order }) {
  return (
    <div className="border border-zinc-100 p-6 space-y-3">
      <div className="flex justify-between text-[10px] uppercase tracking-widest">
        <span>Order #{order.id.slice(0, 8)}</span>
        <span className="italic">{order.status}</span>
      </div>

      <p className="text-2xl font-black italic">
        {formatPKR(order.total_amount)}
      </p>

      <p className="text-[10px] text-zinc-400">
        {new Date(order.created_at).toDateString()}
      </p>
    </div>
  );
}
