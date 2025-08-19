"use client";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const AuthForms = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) throw new Error("Data is Invalid");
      } else {
        // Validation for signup
        if (!formData.name || !formData.age) {
          throw new Error("Please fill in all fields");
        }
        if (parseInt(formData.age) < 1) {
          throw new Error("Please enter a valid age");
        }

        const { error } = await signUp(
          formData.email,
          formData.password,
          formData.name,
          formData.age
        );
        if (error) throw error;

        setError("Check your email for verification link!");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  //   const toggleForm = () => {
  //     setIsLogin(!isLogin);
  //     setError("");
  //     setFormData({
  //       name: "",
  //       age: "",
  //       email: "",
  //       password: "",
  //     });
  //   };

  return (
    <>
      <div className="min-h-screen bg-[#FFFAF0]">
        <Navbar />
        <div className="max-w-screen-2xl mx-auto py-2 px-4 sm:px-6 lg:px-8 mt-[100px]">
          <div className="max-w-md w-full space-y-8 mx-auto border-[1px] border-[#8a1912] rounded-lg">
            <div className="mx-auto p-12 rounded-md">
              <h2 className=" text-center text-3xl font-extrabold text-[#8A1912] pb-2">
                {isLogin ? "Sign in " : "Create new account"}
              </h2>
              <div className="shadow-sm space-y-px bg-transparent">
                <div>
                  <input
                    name="email"
                    type="email"
                    required
                    className="appearance-none bg-transparent my-2 relative block w-full px-3 py-2 border border-[#a14741] placeholder-gray-800 text-gray-900 rounded-sm focus:outline-none focus:ring-white focus:border-[#8A1912] focus:z-10 sm:text-sm"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <input
                    name="password"
                    type="password"
                    required
                    className="appearance-none bg-transparent my-2 relative block w-full px-3 py-2 border border-[#a14741] placeholder-gray-500 text-gray-800 rounded-sm focus:outline-none focus:ring-white focus:border-[#8A1912] focus:z-10 sm:text-sm"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center">{error}</div>
              )}

              <div>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-[18px] font-medium rounded-md text-white bg-[#8A1912] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
                </button>
              </div>

              {/* <div className="text-center">
                <button
                  type="button"
                  onClick={toggleForm}
                  className="font-medium text-gray-300"
                >
                  {isLogin
                    ? "Don't have an account? Sign up"
                    : "Already have an account? Sign in"}
                </button>
              </div> */}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default AuthForms;
