
export default function Footer() {
  return (
    <footer className="bg-[#F0F0F0] pt-60 lg:pt-40 pb-10 relative mt-40">
      {/* Newsletter Box */}
      <div className="absolute -top-32 left-0 right-0 px-4">
        <div className="max-w-7xl mx-auto bg-black rounded-[20px] p-6 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-6">
          <h2 className="text-white text-3xl lg:text-4xl font-black italic uppercase text-center lg:text-left">
            STAY UPTO DATE ABOUT OUR LATEST OFFERS
          </h2>
          <div className="w-full lg:w-1/3 flex flex-col gap-3">
            <input type="email" placeholder="Enter your email" className="w-full py-3 px-6 rounded-full" />
            <button className="w-full py-3 px-6 rounded-full bg-white font-bold">Subscribe</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
        <div className="sm:col-span-2">
          <h3 className="text-3xl font-black mb-5 tracking-tighter">SHOP.CO</h3>
          <p className="text-gray-500 text-sm max-w-xs">We have clothes that suit your style and which you're proud to wear.</p>
        </div>
        <div>
          <h4 className="font-bold mb-4 uppercase tracking-widest text-sm">Company</h4>
          <ul className="text-gray-500 space-y-2 text-sm">
            <li>About</li><li>Features</li><li>Works</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
