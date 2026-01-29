
import React from 'react';
import { Product } from '../types';
import { useAuth } from '../App';

const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'CyberSentinel Pro V2', price: 1299.99, description: 'Military grade encryption module for high-speed networks.', category: 'Hardware', image: 'https://picsum.photos/400/300?random=1', stock: 15 },
  { id: '2', name: 'NeuralNet AI Core', price: 2499.00, description: 'Edge processing unit for decentralized machine learning tasks.', category: 'AI', image: 'https://picsum.photos/400/300?random=2', stock: 8 },
  { id: '3', name: 'GhostKey Hardware Wallet', price: 149.99, description: 'Offline private key storage with self-destruct mechanism.', category: 'Security', image: 'https://picsum.photos/400/300?random=3', stock: 42 },
  { id: '4', name: 'Spectre Laptop Elite', price: 3200.00, description: 'Secure OS pre-installed with hardened kernel and hardware killswitches.', category: 'Laptops', image: 'https://picsum.photos/400/300?random=4', stock: 3 },
  { id: '5', name: 'Vortex VPN Gateway', price: 499.99, description: 'Dedicated hardware VPN appliance for enterprise-level privacy.', category: 'Networking', image: 'https://picsum.photos/400/300?random=5', stock: 20 },
  { id: '6', name: 'SecureStream Cam 4K', price: 299.00, description: 'Privacy-focused security camera with local storage and end-to-end encryption.', category: 'Cameras', image: 'https://picsum.photos/400/300?random=6', stock: 12 }
];

const ShopPage: React.FC = () => {
  const { addToCart } = useAuth();

  return (
    <div className="space-y-8">
      <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center">
        <img src="https://picsum.photos/1200/400?grayscale" alt="Banner" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="relative text-center space-y-4 px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white">Next-Gen Privacy Hardware</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">Equip yourself with tools that prioritize your security. No backdoors, no tracking, pure performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_PRODUCTS.map(product => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition group">
            <div className="relative h-48 overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm">
                {product.category}
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-slate-800">{product.name}</h3>
                <span className="text-lg font-bold text-blue-600">${product.price.toLocaleString()}</span>
              </div>
              <p className="text-slate-500 text-sm line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between pt-4">
                <span className={`text-xs font-medium ${product.stock < 5 ? 'text-red-500' : 'text-emerald-500'}`}>
                  {product.stock < 5 ? `Only ${product.stock} left!` : 'In Stock'}
                </span>
                <button 
                  onClick={() => addToCart(product)}
                  className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition active:scale-95"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopPage;
