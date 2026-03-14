import { formatPKR } from '../utils/formatPrice';

export default function CartItem({ item, onRemove }) {
  return (
    <div className="flex gap-6 border-b border-zinc-100 pb-8">
      <img src={item.image} className="w-24 h-32 object-cover" />

      <div className="flex-1">
        <h3 className="font-bold uppercase text-sm">{item.title}</h3>
        <p className="text-[10px] uppercase text-zinc-400 mt-1">
          Size: {item.variantName}
        </p>
        <p className="mt-2 font-bold">{formatPKR(item.price)}</p>
      </div>

      <button
        onClick={() => onRemove(item.variant_id)}
        className="text-[10px] uppercase underline"
      >
        Remove
      </button>
    </div>
  );
}
