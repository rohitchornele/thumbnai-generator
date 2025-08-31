import axios from 'axios';
import React, { useContext } from "react";
import { assets, plans } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BuyCredit = () => {
  const { user, setShowLogin, backendUrl, loadCreditData, token } = useContext(AppContext);
  const navigate = useNavigate();

  const initPay = async (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Credits Payment",
      description: "Credits Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            backendUrl + "/api/user/verify-payment",
            response,
            { headers: { token } }
          );
          if (data.success) {
            loadCreditData();
            navigate("/");
            toast.success("Credits Added Successfully");
          }
        } catch (error) {
          toast.error(error.message);
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const paymentRazorpay = async (planId) => {
    try {
      if (!user) {
        setShowLogin(true);
      }
      const { data } = await axios.post(
        backendUrl + "/api/user/payment",
        { planId },
        { headers: { token } }
      );
      if (data.success) {
        initPay(data.order);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <motion.div
      className="min-h-[80vh] text-center pt-14 mb-10 px-4"
      initial={{ opacity: 0.2, y: 80 }}
      transition={{ duration: 0.8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <button
        className="
          border border-white/20 px-6 py-1.5 rounded-full mb-6
          text-white/80
          bg-[var(--bg-app)]/40
        "
      >
        Our Plans
      </button>

      <h1 className="text-3xl font-medium mb-6 sm:mb-10 text-white">
        Choose the Plan
      </h1>

      <div className="flex flex-wrap justify-center gap-10 text-left">
        {plans.map((item, index) => (
          <div
            className="
              w-[10rem] sm:w-76
              rounded-lg
              border border-white/20
              bg-[var(--bg-app)]/60
              p-8
              space-y-5
              text-white
              transition-colors
              motion-safe:transform-gpu motion-safe:will-change-transform motion-safe:transition-transform
              motion-safe:hover:-translate-y-0.5 motion-safe:hover:scale-[1.01]
              duration-[260ms] ease-[cubic-bezier(0.22,1,0.36,1)]
            "
            key={index}
          >
            <img src={assets.logo_icon} alt="" width={40} className="opacity-90" />
            <p className="font-semibold mt-3 mb-3">{item.id}</p>
            <p className="text-sm text-white/70">{item.desc}</p>
            <p className="mt-8">
              <span className="text-3xl font-medium">${item.price}</span>
              <span className="text-white/60"> / {item.credits} credits</span>
            </p>
            <button
              className="
                w-full mt-8 text-sm rounded-md py-2.5 min-w-52
                text-black bg-[var(--accent-orange)]
                hover:opacity-90
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-red)]
                motion-safe:transform-gpu motion-safe:transition-transform motion-safe:hover:scale-[1.02]
                duration-[220ms]
                cursor-pointer
              "
              onClick={() => paymentRazorpay(item.id)}
            >
              {user ? "Get Credits" : "Get Started"}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default BuyCredit;
