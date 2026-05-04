"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Send, AlertTriangle, CheckCircle2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";


const INITIAL_FORM = {
  company: "",
  role: "",
  level_standardized: "L3",
  location: "",
  experience_years: 0,
  base_salary: 0,
  bonus: 0,
  stock: 0,
  confidence: 100,
};

export const SubmitSalaryModal = ({ isOpen, onClose, onSuccess }: any) => {
  const [formData, setFormData] = useState({ ...INITIAL_FORM });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch(`${API_BASE_URL}/api/ingest-salary`, {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Validation Failed");
      setStatus("success");
      onSuccess();
      setTimeout(() => {
        setFormData({ ...INITIAL_FORM });
        setStatus("idle");
        onClose();
      }, 2000);
    } catch (err) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const handleClose = () => {
    setFormData({ ...INITIAL_FORM });
    setStatus("idle");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl glass p-5 md:p-8 rounded-[24px] md:rounded-[40px] border-primary/20 shadow-2xl overflow-y-auto max-h-[90vh]"
      >

        <button onClick={handleClose} className="absolute right-6 top-6 text-slate-500 hover:text-white transition-colors">
          <X size={24} />
        </button>

        <header className="mb-8">
          <div className="text-[10px] font-black text-primary uppercase tracking-[0.5em] mb-2">Add Salary Data</div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter">Submit Compensation</h2>
          <p className="text-slate-500 text-xs mt-2">All data is validated and normalized before storage.</p>
        </header>

        {status === "success" ? (
          <div className="py-20 text-center space-y-4">
            <CheckCircle2 size={64} className="text-success mx-auto animate-bounce" />
            <h3 className="text-2xl font-black uppercase text-white">Submitted Successfully</h3>
            <p className="text-slate-500 font-mono text-sm">Your data has been added to the system.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Company</label>
                <input
                  required
                  type="text"
                  value={formData.company}
                  placeholder="e.g. Google"
                  className="w-full bg-black/40 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-primary transition-colors font-mono text-xs"
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Role</label>
                <input
                  required
                  type="text"
                  value={formData.role}
                  placeholder="e.g. Software Engineer"
                  className="w-full bg-black/40 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-primary transition-colors font-mono text-xs"
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Level</label>
                <select
                  value={formData.level_standardized}
                  className="w-full bg-black/40 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-primary transition-colors font-black uppercase text-xs tracking-widest"
                  onChange={(e) => setFormData({ ...formData, level_standardized: e.target.value })}
                >
                  <option value="L3">L3 — Junior</option>
                  <option value="L4">L4 — Mid-Level</option>
                  <option value="L5">L5 — Senior</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Years of Experience</label>
                <input
                  required
                  type="number"
                  min="0"
                  value={formData.experience_years || ""}
                  className="w-full bg-black/40 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-primary transition-colors font-mono"
                  onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Location</label>
                <input
                  required
                  type="text"
                  value={formData.location}
                  placeholder="e.g. Bangalore, IN"
                  className="w-full bg-black/40 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-primary transition-colors font-mono text-xs"
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            <div className="h-[1px] w-full bg-slate-800 my-8" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] text-primary uppercase font-black tracking-widest">Base Salary ($)</label>
                <input
                  required
                  type="number"
                  min="1"
                  value={formData.base_salary || ""}
                  className="w-full bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 text-white focus:border-primary transition-colors font-mono"
                  onChange={(e) => setFormData({ ...formData, base_salary: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-accent uppercase font-black tracking-widest">Annual Bonus ($)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.bonus || ""}
                  placeholder="0"
                  className="w-full bg-accent/5 border border-accent/20 rounded-xl px-4 py-3 text-white focus:border-accent transition-colors font-mono"
                  onChange={(e) => setFormData({ ...formData, bonus: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-success uppercase font-black tracking-widest">Stock per Year ($)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock || ""}
                  placeholder="0"
                  className="w-full bg-success/5 border border-success/20 rounded-xl px-4 py-3 text-white focus:border-success transition-colors font-mono"
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            {(formData.base_salary > 0) && (
              <div className="glass p-4 rounded-xl border-primary/10 text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Estimated Total Compensation</p>
                <p className="text-2xl font-black text-primary">${(formData.base_salary + formData.bonus + formData.stock).toLocaleString()}</p>
              </div>
            )}

            <div className="pt-4">
              <button
                disabled={status === "submitting"}
                type="submit"
                className="w-full bg-primary py-5 rounded-2xl text-black font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {status === "submitting" ? (
                  <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={20} /> Submit Salary
                  </>
                )}
              </button>
            </div>

            {status === "error" && (
              <div className="flex items-center gap-2 text-red-500 justify-center font-black text-[10px] uppercase tracking-widest">
                <AlertTriangle size={14} /> Submission failed. Please check your data and try again.
              </div>
            )}
          </form>
        )}
      </motion.div>
    </div>
  );
};
