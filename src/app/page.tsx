"use client"

import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Helpers
const BD_PHONE_REGEX = /^(\+?88)?01[3-9]\d{8}$/; // +8801XXXXXXXXX or 01XXXXXXXXX
const FB_URL_REGEX = /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.com)\/[A-Za-z0-9_.-]+\/?$/i;

const schema = z
  .object({
    fullName: z.string().min(2, "কমপক্ষে ২ অক্ষর দিন"),
    dob: z
      .string()
      .optional()
      .refine(
        (v) => !v || !Number.isNaN(Date.parse(v)),
        "সঠিক জন্মতারিখ দিন"
      )
      .refine(
        (v) => {
          if (!v) return true;
          const d = new Date(v);
          const now = new Date();
          return d < now;
        },
        "ভবিষ্যতের তারিখ দেওয়া যাবে না"
      ),
    age: z
      .string()
      .optional()
      .refine(
        (v) => !v || /^\d{1,3}$/.test(v),
        "সঠিক বয়স (সংখ্যা) দিন"
      )
      .refine((v) => !v || (Number(v) >= 8 && Number(v) <= 120), "বয়স ৮–১২০ এর মধ্যে দিন"),
    phone: z
      .string()
      .min(1, "মোবাইল নাম্বার দিন")
      .regex(BD_PHONE_REGEX, "বাংলাদেশি মোবাইল ফরম্যাট দিন (যেমন 01XXXXXXXXX বা +8801XXXXXXXXX)"),
    email: z.string().email("সঠিক ইমেইল দিন"),
    facebook: z
      .string()
      .optional()
      .refine((v) => !v || FB_URL_REGEX.test(v), "সঠিক ফেসবুক প্রোফাইল লিংক দিন"),
    address: z.string().min(5, "সম্পূর্ণ ঠিকানা লিখুন"),
    occupation: z.string().min(2, "পেশা লিখুন"),
    paymentMethod: z.enum(["bkash", "nagad"], {
      required_error: "পেমেন্ট মাধ্যম সিলেক্ট করুন",
    }),
    transactionId: z
      .string()
      .min(6, "ট্রাঞ্জেকশন আইডি দিন")
      .max(50, "ট্রাঞ্জেকশন আইডি অতিরিক্ত বড়"),
    confirmPaid: z.literal(true, {
      errorMap: () => ({ message: "ফি প্রদানের সম্মতি দিন" }),
    }),
  })
  .superRefine((data, ctx) => {
    // Require at least one of dob or age
    if (!data.dob && !data.age) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "জন্ম তারিখ বা বয়স—যেকোনো একটি দিন",
        path: ["dob"],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "জন্ম তারিখ বা বয়স—যেকোনো একটি দিন",
        path: ["age"],
      });
    }
  });

type FormValues = z.infer<typeof schema>;

export default function SeminarRegistrationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const [copied, setCopied] = useState<string | null>(null);
  const paymentMethod = watch("paymentMethod");
  const payNumber = useMemo(
    () => (paymentMethod === "nagad" ? "+8801881-550721" : "+8801878-952705"),
    [paymentMethod]
  );

  const onSubmit = (data: FormValues) => {
    // FRONTEND ONLY: show payload in console or toast (no backend call)
    console.log("Form payload:", data);
    alert("ফর্মটি সফলভাবে যাচাই হয়েছে (ফ্রন্টএন্ড ডেমো)।");
    reset();
  };

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto w-full max-w-2xl">
        {/* Header Card */}
        <div className="bg-white shadow-sm rounded-2xl p-6 mb-6 border">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            উম্মাহর জাগরণে করনীয় শীর্ষক সেমিনার ২০২৫
          </h1>
          <p className="mt-2 text-gray-600">
            এই সেমিনারে অংশগ্রহণের জন্য নিম্নের ফর্মটি পূরণ করুন ও সাবমিট করুন।
          </p>

          {/* Event meta */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div className="rounded-xl border p-3">
              <div className="font-semibold text-gray-800">রেজি. ফি</div>
              <div className="text-gray-700">৬০০৳</div>
            </div>
            <div className="rounded-xl border p-3">
              <div className="font-semibold text-gray-800">পেমেন্ট</div>
              <div className="text-gray-700">বিকাশ/নগদ</div>
            </div>
            <div className="rounded-xl border p-3">
              <div className="font-semibold text-gray-800">যোগাযোগ</div>
              <div className="text-gray-700 break-all">
                +880 1878-952705 / +880 1881-550721
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="bg-white shadow-sm rounded-2xl border p-6 space-y-6"
        >
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              পূর্ণ নাম <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              {...register("fullName")}
              placeholder="আপনার পূর্ণ নাম"
              className="w-full rounded-xl border px-4 py-2.5 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400"
            />
            {errors.fullName && (
              <p className="text-sm text-red-600 mt-1">{errors.fullName.message}</p>
            )}
          </div>

          {/* DOB or Age */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                জন্ম তারিখ (যদি থাকে)
              </label>
              <input
                type="date"
                {...register("dob")}
                className="w-full rounded-xl border px-4 py-2.5 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400"
              />
              {errors.dob && (
                <p className="text-sm text-red-600 mt-1">{errors.dob.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                বয়স (যদি জন্ম তারিখ না দেন)
              </label>
              <input
                type="number"
                inputMode="numeric"
                min={8}
                max={120}
                placeholder="যেমন: 22"
                {...register("age")}
                className="w-full rounded-xl border px-4 py-2.5 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400"
              />
              {errors.age && (
                <p className="text-sm text-red-600 mt-1">{errors.age.message}</p>
              )}
            </div>
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                মোবাইল নাম্বার <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                placeholder="01XXXXXXXXX বা +8801XXXXXXXXX"
                {...register("phone")}
                className="w-full rounded-xl border px-4 py-2.5 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400"
              />
              <p className="text-xs text-gray-500 mt-1">
                হোয়াটসঅ্যাপ চালু থাকা নাম্বার দিন (না থাকলে রেগুলার ব্যবহৃত নাম্বার)।
              </p>
              {errors.phone && (
                <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                ইমেইল ঠিকানা <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className="w-full rounded-xl border px-4 py-2.5 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400"
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Facebook (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              ফেইসবুক আইডি লিংক (যদি থাকে)
            </label>
            <input
              type="url"
              placeholder="https://facebook.com/your.profile"
              {...register("facebook")}
              className="w-full rounded-xl border px-4 py-2.5 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400"
            />
            {errors.facebook && (
              <p className="text-sm text-red-600 mt-1">{errors.facebook.message}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              গ্রাম, ইউনিয়ন, থানা ও জেলা <span className="text-red-600">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="আপনার সম্পূর্ণ ঠিকানা লিখুন"
              {...register("address")}
              className="w-full rounded-xl border px-4 py-2.5 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400"
            />
            {errors.address && (
              <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>
            )}
          </div>

          {/* Occupation */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              পেশা <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder="যেমন: ছাত্র/শিক্ষক/ব্যবসায়ী/কর্মজীবী"
              {...register("occupation")}
              className="w-full rounded-xl border px-4 py-2.5 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400"
            />
            {errors.occupation && (
              <p className="text-sm text-red-600 mt-1">{errors.occupation.message}</p>
            )}
          </div>

          {/* Payment Section */}
          <div className="rounded-2xl border p-4 sm:p-5">
            <h3 className="font-semibold text-gray-900 text-lg">
              রেজিষ্ট্রেশন ফি প্রদান (৬০০৳)
            </h3>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 rounded-xl border p-3 cursor-pointer">
                <input
                  type="radio"
                  value="bkash"
                  {...register("paymentMethod")}
                  className="h-4 w-4"
                />
                <div>
                  <div className="font-medium text-gray-800">বিকাশ</div>
                  <div className="text-sm text-gray-600 break-all">+880 1878-952705</div>
                </div>
                <button
                  type="button"
                  onClick={() => copy("+8801878-952705", "bkash")}
                  className="ml-auto text-xs border rounded-lg px-2 py-1 hover:bg-gray-50"
                >
                  {copied === "bkash" ? "কপি হয়েছে" : "কপি"}
                </button>
              </label>

              <label className="flex items-center gap-3 rounded-xl border p-3 cursor-pointer">
                <input
                  type="radio"
                  value="nagad"
                  {...register("paymentMethod")}
                  className="h-4 w-4"
                />
                <div>
                  <div className="font-medium text-gray-800">নগদ</div>
                  <div className="text-sm text-gray-600 break-all">+880 1881-550721</div>
                </div>
                <button
                  type="button"
                  onClick={() => copy("+8801881-550721", "nagad")}
                  className="ml-auto text-xs border rounded-lg px-2 py-1 hover:bg-gray-50"
                >
                  {copied === "nagad" ? "কপি হয়েছে" : "কপি"}
                </button>
              </label>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-800 mb-1">
                ট্রাঞ্জেকশন নাম্বার <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                placeholder="যেমন: TXN8ABCD1234"
                {...register("transactionId")}
                className="w-full rounded-xl border px-4 py-2.5 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400"
              />
              <p className="text-xs text-gray-500 mt-1">
                পেমেন্ট করার পর আপনার ট্রাঞ্জেকশন আইডি লিখুন। মাধ্যম:{" "}
                <span className="font-medium">{paymentMethod === "nagad" ? "নগদ" : "বিকাশ"}</span> (
                {payNumber})
              </p>
              {errors.transactionId && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.transactionId.message}
                </p>
              )}
            </div>

            <label className="mt-4 flex items-center gap-2">
              <input type="checkbox" {...register("confirmPaid")} className="h-4 w-4" />
              <span className="text-sm text-gray-700">
                নিশ্চয়তা দিচ্ছি যে আমি ৬০০৳ রেজিস্ট্রেশন ফি প্রদান করেছি।
              </span>
            </label>
            {errors.confirmPaid && (
              <p className="text-sm text-red-600 mt-1">
                {errors.confirmPaid.message as string}
              </p>
            )}
          </div>

          {/* Footer note */}
          <p className="text-xs text-gray-500">
            পাসওয়ার্ড বা সংবেদনশীল কোনো তথ্য কখনোই জমা দেবেন না। প্রয়োজনে হোয়াটসঅ্যাপে
            কনফার্ম করুন।
          </p>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="inline-flex justify-center rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "সাবমিট হচ্ছে..." : "সাবমিট করুন"}
            </button>
            <button
              type="button"
              onClick={() => reset()}
              className="rounded-xl border px-4 py-2.5 hover:bg-gray-50"
            >
              রিসেট
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 mt-6">
          This content is neither created nor endorsed by Google.
        </div>
      </div>
    </div>
  );
}
