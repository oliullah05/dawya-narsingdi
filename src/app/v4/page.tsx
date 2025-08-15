"use client";

import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

/* ── Validation ────────────────────────────────────────────────────────── */
const ANY_PHONE_REGEX = /^\+?[0-9\s().-]{7,20}$/;
const FB_URL_REGEX =
  /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.com)\/[A-Za-z0-9_.-]+\/?$/i;

const schema = z
  .object({
    fullName: z.string().trim().min(2, "আপনার নাম লিখুন"),
    dob: z
      .string()
      .optional()
      .refine((v) => !v || !Number.isNaN(Date.parse(v)), "সঠিক জন্মতারিখ দিন"),
    age: z
      .string()
      .optional()
      .refine((v) => !v || /^\d{1,3}$/.test(v), "সঠিক বয়স দিন")
      .refine((v) => !v || (+v >= 8 && +v <= 120), "বয়স ৮–১২০ এর মধ্যে দিন"),
    phone: z.string().trim().regex(ANY_PHONE_REGEX, "সঠিক ফোন নম্বর লিখুন"),
    // email: z.string().trim().email("সঠিক ইমেইল দিন"),
email: z
  .string()
  .trim()
  .optional()
  .superRefine((val, ctx) => {
    if (!val) return; // optional: skip if empty/undefined
    const ok = z.string().email().safeParse(val).success;
    if (!ok) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "সঠিক ইমেইল দিন",
      });
    }
  }),
    facebook: z
      .string()
      .optional()
      .refine((v) => !v || FB_URL_REGEX.test(v), "সঠিক ফেসবুক লিংক দিন"),
    // address: z.string().trim().min(5, "সম্পূর্ণ ঠিকানা লিখুন"),
    address: z.string().trim().optional(),
    occupation: z.string().trim().optional(),
    paymentMethod: z.enum(["bkash", "nagad"], {
      required_error: "পেমেন্ট মাধ্যম সিলেক্ট করুন",
      invalid_type_error: "পেমেন্ট মাধ্যম সিলেক্ট করুন",
    }),
    transactionId: z
      .string()
      .trim()
      .min(6, "ট্রাঞ্জেকশন আইডি দিন")
      .max(50, "ট্রাঞ্জেকশন আইডি অতিরিক্ত বড়"),
    agree: z.literal(true, {
      errorMap: () => ({ message: "শর্তে সম্মতি দিন" }),
    }),
  })
//   .superRefine((d, ctx) => {
//     if (!d.dob && !d.age) {
//       ctx.addIssue({
//         code: "custom",
//         message: "জন্ম তারিখ বা বয়স—যেকোনো একটি দিন",
//         path: ["dob"],
//       });
//       ctx.addIssue({
//         code: "custom",
//         message: "জন্ম তারিখ বা বয়স—যেকোনো একটি দিন",
//         path: ["age"],
//       });
//     }
    
//   });

type FormValues = z.infer<typeof schema>;

/* ── UI helpers (alignment-safe) ───────────────────────────────────────── */
const inputBase =
  "w-full rounded-xl border px-4 py-3 text-slate-900 bg-white placeholder:text-slate-400 outline-none transition focus:ring-4";
const inputOk =
  "border-slate-200 focus:border-indigo-400 focus:ring-indigo-100";
const inputErr = "border-rose-300 focus:border-rose-400 focus:ring-rose-100";

const ErrorLine = ({ msg }: { msg?: string }) => (
  <p
    className={`mt-1 h-5 text-xs ${
      msg ? "text-rose-600 visible" : "invisible"
    }`}
  >
    {msg || "placeholder"}
  </p>
);

const Field = ({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col  justify-center">
    <div className="mb-1">
      <p className="text-sm font-medium text-slate-800">
        {label} {required && <span className="text-rose-500">*</span>}
      </p>
    </div>
    {children}
    {error && <ErrorLine msg={error} />}
  </div>
);

export default function FancySeminarRegisterFormLight() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
    watch,
    
  } = useForm<FormValues>({ resolver: zodResolver(schema), mode: "onChange", defaultValues: {
    paymentMethod: "bkash", 
  }, });

  const [copied, setCopied] = useState<string | null>(null);
  const paymentMethod = watch("paymentMethod");
  const payNumber = useMemo(
    () => (paymentMethod === "nagad" ? "+8801881-550721" : "+8801878-952705"),
    [paymentMethod]
  );

  const onSubmit = (data: FormValues) => {
    console.log(data);
    alert("🎉 রেজিস্ট্রেশন তথ্য যাচাই সম্পন্ন (ডেমো)।");
    reset();
  };

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1200);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7fafc] via-[#f5f7ff] to-[#f7fafc] py-10 px-4">
      {/* Hero */}
      <div className="mx-auto mb-6 max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <div className="absolute inset-0 bg-[radial-gradient(1200px_400px_at_-10%_-10%,rgba(99,102,241,0.15),transparent),radial-gradient(800px_300px_at_110%_20%,rgba(16,185,129,0.12),transparent)]" />
          <div className="relative p-8 md:p-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs text-indigo-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />{" "}
              Seats are limited
            </span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              উম্মাহর জাগরণে করনীয় শীর্ষক সেমিনার ২০২৫
            </h1>
            <p className="mt-2 max-w-2xl text-slate-600">
              অংশগ্রহণের জন্য নিচের ফর্মটি পূরণ করে সাবমিট করুন। যাচাইকৃত আসন
              নিশ্চিত করতে রেজিস্ট্রেশন ফি প্রদান করুন।
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1">
                রেজি. ফি ৬০০৳
              </span>
              <span className="rounded-full bg-sky-50 text-sky-700 border border-sky-200 px-3 py-1">
                বিকাশ/নগদ গ্রহণযোগ্য
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-5"
      >
        {/* Main */}
        <div className="space-y-5 md:col-span-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-7">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field
                label="পূর্ণ নাম"
                required
                error={errors.fullName?.message}
              >
                <input
                  {...register("fullName")}
                  aria-invalid={!!errors.fullName}
                  placeholder="আপনার পূর্ণ নাম লিখুন."
                  className={`${inputBase} ${
                    errors.fullName ? inputErr : inputOk
                  }`}
                />
              </Field>

              <Field label="ইমেইল ঠিকানা" error={errors.email?.message}>
                <input
                  type="email"
                  {...register("email")}
                  aria-invalid={!!errors.email}
                  placeholder="আপনার ইমেইল লিখুন."
                  className={`${inputBase} ${errors.email ? inputOk : inputOk}`}
                />
                {/* This error for matching fullname alignment */}
                {errors.fullName && <p className="opacity-0">s</p>}
              </Field>

              <Field
                label="জন্ম তারিখ (ঐচ্ছিক)"
                error={errors.dob?.message as string | undefined}
              >
                <input
                  type="date"
                  {...register("dob")}
                  aria-invalid={!!errors.dob}
                  className={`${inputBase} ${
                    errors.dob
                      ? inputErr
                      : "border-slate-200 focus:border-sky-400 focus:ring-sky-100"
                  }`}
                />
              </Field>

              <Field label="পেশা" error={errors.occupation?.message}>
                <input
                  {...register("occupation")}
                  aria-invalid={!!errors.occupation}
                  placeholder="যেমন: ছাত্র/শিক্ষক/ব্যবসায়ী"
                  className={`${inputBase} ${
                    errors.occupation ? inputErr : inputOk
                  }`}
                />
              </Field>

              <div className="md:col-span-2">
                <Field
                  label="মোবাইল নাম্বার (হোয়াটসঅ্যাপ থাকা নাম্বার দিন)"
                  required
                  error={errors.phone?.message}
                >
                  <input
                    type="tel"
                    {...register("phone")}
                    aria-invalid={!!errors.phone}
                    placeholder="+8801XXXXXXXXX"
                    className={`${inputBase} ${
                      errors.phone ? inputErr : inputOk
                    }`}
                  />
                </Field>
              </div>

              <Field
                label="ফেইসবুক আইডি লিংক (ঐচ্ছিক)"
                error={errors.facebook?.message as string | undefined}
              >
                <input
                  type="url"
                  {...register("facebook")}
                  aria-invalid={!!errors.facebook}
                  placeholder="https://facebook.com/your.profile"
                  className={`${inputBase} ${
                    errors.facebook
                      ? inputErr
                      : "border-slate-200 focus:border-violet-400 focus:ring-violet-100"
                  }`}
                />
              </Field>

              <div>
                <Field
                  label="গ্রাম, ইউনিয়ন, থানা ও জেলা"
                  error={errors.address?.message}
                >
                  <input
                    {...register("address")}
                    aria-invalid={!!errors.address}
                    placeholder="সম্পূর্ণ ঠিকানা"
                    className={`${inputBase} ${
                      errors.address
                        ? inputErr
                        : "border-slate-200 focus:border-violet-400 focus:ring-violet-100"
                    }`}
                  />
                </Field>
              </div>
            </div>
          </div>

          <div className="space-y-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-7">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                {...register("agree")}
                className="mt-1 h-5 w-5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-300"
              />
              <span className="text-sm leading-relaxed text-slate-700">
                উপরে দেয়া তথ্য সঠিক। প্রয়োজন হলে আয়োজক কর্তৃপক্ষ আমার সাথে
                যোগাযোগ করতে পারবেন।
              </span>
            </label>
            <ErrorLine msg={errors.agree?.message as string | undefined} />

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : "Confirm & Register"}
              </button>
              <button
                type="button"
                onClick={() => reset()}
                className="rounded-xl border border-slate-300 px-5 py-3 text-slate-700 hover:bg-slate-50"
              >
                Reset
              </button>
              {isSubmitSuccessful && (
                <span className="text-sm text-emerald-600">
                  ✅ Submitted (demo front-end)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Payment */}
        <aside className="space-y-5 md:col-span-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-7">
            <h3 className="text-lg font-semibold text-slate-900">পেমেন্ট</h3>
            <p className="mt-1 text-sm text-slate-600">
              রেজিস্ট্রেশন ফি: <span className="font-semibold">৬০০৳</span>
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <label>
                <input
                  type="radio"
                  value="bkash"
                  {...register("paymentMethod")}
                  className="peer hidden"
                />
                <div className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-slate-700 peer-checked:border-indigo-500 peer-checked:ring-4 peer-checked:ring-indigo-100">
                  বিকাশ
                </div>
              </label>
              <label>
                <input
                  type="radio"
                  value="nagad"
                  {...register("paymentMethod")}
                  className="peer hidden"
                />
                <div className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-slate-700 peer-checked:border-emerald-500 peer-checked:ring-4 peer-checked:ring-emerald-100">
                  নগদ
                </div>
              </label>
            </div>
            <ErrorLine
              msg={errors.paymentMethod?.message as string | undefined}
            />

            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-sm text-slate-600">বর্তমান নম্বর</div>
                <div className="font-medium text-slate-900">{payNumber}</div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => copy("+8801878952705", "bkash")}
                  className="flex-1 rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  কপি বিকাশ
                </button>
                <button
                  type="button"
                  onClick={() => copy("+8801881550721", "nagad")}
                  className="flex-1 rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  কপি নগদ
                </button>
              </div>
              {copied && (
                <p className="mt-1 text-xs text-emerald-600">কপি হয়েছে!</p>
              )}
            </div>

            <div className="mt-4">
              <Field
                label="ট্রাঞ্জেকশন আইডি"
                required
                error={errors.transactionId?.message}
              >
                <input
                  {...register("transactionId")}
                  aria-invalid={!!errors.transactionId}
                  placeholder="যেমন: TXN8ABCD1234"
                  className={`${inputBase} ${
                    errors.transactionId
                      ? inputErr
                      : "border-slate-200 focus:border-emerald-400 focus:ring-emerald-100"
                  }`}
                />
              </Field>
              <p className="text-xs mt-1 text-slate-600">
                পেমেন্টের পর আপনার ট্রাঞ্জেকশন আইডি লিখুন। প্রয়োজনে হোয়াটসঅ্যাপে
                নিশ্চিত করুন।
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 text-xs text-slate-600 shadow-sm">
            পাসওয়ার্ড বা সংবেদনশীল তথ্য দেবেন না। প্রদত্ত তথ্য শুধুমাত্র
            রেজিস্ট্রেশন যাচাইকরণের জন্য ব্যবহৃত হবে।
          </div>
        </aside>
      </form>
    </div>
  );
}
