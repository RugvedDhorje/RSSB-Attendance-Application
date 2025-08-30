"use client";
import { supabase, supabaseAdmin } from "../lib/supebase";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email, password, name, age) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;

      if (data.user) {
        const { error: insertError } = await supabaseAdmin
          .from("users")
          .insert([
            {
              id: data.user.id,
              name,
              age: parseInt(age, 10),
              email,
            },
          ]);
        if (insertError) throw insertError;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const markAttendance = async (memberId) => {
    // setLoading(true);
    const today = new Date().toISOString().split("T")[0];
    const currentTime = new Date().toTimeString().split(" ")[0];

    try {
      // Check if member exists
      const { data: member, error: memberError } = await supabase
        .from("members")
        .select("*")
        .ilike("qr_id", memberId.trim())
        // .or(`qr_id.ilike.${memberId.trim()},id.eq.${memberId.trim()}`)
        .single();

      if (memberError || !member) {
        alert("Member not found!");
        // setLoading(false);
        return;
      }

      // Check if attendance already marked today
      // const { data: existingAttendance, error: checkError } = await supabase
      //   .from("attendance")
      //   .select("*")
      //   .eq("qr_id", memberId)
      //   .eq("date", today);

      // if (checkError) {
      //   alert("Error checking attendance: " + checkError.message);
      //   setLoading(false);
      //   return;
      // }

      // if (existingAttendance && existingAttendance.length > 0) {
      //   alert("Attendance already marked for today!");
      //   setLoading(false);
      //   return;
      // }

      // Mark attendance
      const attendanceData = {
        qr_id: member.qr_id,
        name: member.name,
        dept: member.dept,
        date: today,
        time: currentTime,
      };
      const { error: insertError } = await supabase
        .from("attendance")
        .insert([attendanceData]);

      if (insertError) {
        alert("Error marking attendance: " + insertError.message);
      } else {
        alert(`Attendance marked successfully for ${member.name}!`);
        // setManualMemberId("");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
    // setLoading(false);
  };
  const value = {
    user,
    signUp,
    signIn,
    signOut,
    markAttendance,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
