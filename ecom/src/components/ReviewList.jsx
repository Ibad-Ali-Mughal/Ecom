
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export const ReviewList = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const fetchReviews = async () => {
    if (!productId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (!error) setReviews(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const submitReview = async () => {
    
    if (!user) {
      console.warn("Submit blocked: No user session found.");
      return; 
    }
    
    if (!newComment.trim()) return alert("Comment cannot be empty!");

    setSubmitting(true);
    const { error } = await supabase
      .from('reviews')
      .insert([{
        product_id: productId,
        user_id: user.id, 
        rating: newRating,
        comment: newComment.trim(),
      }]);

    if (error) {
      console.error("Database Error:", error.message);
      alert("Error: " + error.message);
    } else {
      setNewComment('');
      setNewRating(5);
      fetchReviews();
    }
    setSubmitting(false);
  };

  if (loading) return <div className="py-10 text-center text-gray-400">Loading reviews...</div>;

  return (
    <div className="space-y-10">
      <div className="bg-[#f9f9f9] p-8 rounded-3xl border border-gray-100">
        {!user ? (
          <div className="text-center py-4">
            <h4 className="text-lg font-black uppercase italic mb-2">
              Log in to write a review
            </h4>
            <p className="text-gray-500 text-sm mb-6">
              You must be a member to share your feedback.
            </p>
            <button 
              onClick={() => navigate('/login')}
              className="bg-black text-white px-10 py-3 rounded-full font-bold uppercase text-[10px] tracking-widest hover:bg-gray-800 transition-all"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase text-gray-400">Write your review</h3>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star} 
                  type="button"
                  onClick={() => setNewRating(star)}
                  className={`text-2xl ${newRating >= star ? 'text-black' : 'text-gray-200'}`}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-5 rounded-2xl border border-gray-200 focus:ring-1 focus:ring-black outline-none min-h-[100px]"
              placeholder="Tell us what you think..."
            />
            <button
              onClick={submitReview}
              disabled={submitting}
              className="bg-black text-white px-12 py-3 rounded-full font-black uppercase italic text-xs tracking-widest disabled:opacity-50"
            >
              {submitting ? "Posting..." : "Post Review"}
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-center text-gray-400 italic">No reviews yet for this product.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-50 pb-6">
              <div className="flex justify-between items-center mb-2">
                <div className="text-xs text-black">
                  {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                </div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};