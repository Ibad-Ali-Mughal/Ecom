
import React, { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadUserAndProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const currentUser = session?.user ?? null;

    if (!currentUser) {
      setUser(null);
      setProfile(null);
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    setUser(currentUser);

    const { data: profileData } = await supabase
      .from('profiles')
      .select('id, role, name, email')
      .eq('id', currentUser.id)
      .maybeSingle();

    if (profileData) {
      setProfile(profileData);
      setIsAdmin(profileData.role === 'admin');
    } else {
      setProfile(null);
      setIsAdmin(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUserAndProfile();

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setIsAdmin(false);
        setLoading(false);
      } else {
        loadUserAndProfile();
      }
    });

    return () => {
      if (listener?.subscription) {
        listener.subscription.unsubscribe();
      }
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return React.createElement(
    AuthContext.Provider,
    { value: { user, profile, isAdmin, loading, signOut } },
    children
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};



















