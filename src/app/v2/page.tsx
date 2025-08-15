"use client"
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const BD_PHONE_REGEX = /^(\+?88)?01[3-9]\d{8}$/;
const FB_URL_REGEX = /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.com)\/[A-Za-z0-9_.-]+\/?$/i;

const schema = z
  .object({
    fullName: z.string().min(2, "এটি একটি আবশ্যক প্রশ্ন"),
    dob: z
      .string()
      .optional()
      .refine((v) => !v || !Number.isNaN(Date.parse(v)), "সঠিক জন্মতারিখ দিন"),
    age: z
      .string()
      .optional()
      .refine((v) => !v || /^\d{1,3}$/.test(v), "সঠিক বয়স লিখুন"),
    phone: z.string().min(1, "এটি একটি আবশ্যক প্রশ্ন").regex(BD_PHONE_REGEX, "বাংলাদেশি মোবাইল ফরম্যাট দিন"),
    email: z.string().email("সঠিক ইমেইল দিন"),
    facebook: z.string().optional().refine((v) => !v || FB_URL_REGEX.test(v), "সঠিক ফেসবুক লিংক দিন"),
    address: z.string().min(3, "এটি একটি আবশ্যক প্রশ্ন"),
    occupation: z.string().min(2, "এটি একটি আবশ্যক প্রশ্ন"),
    paymentText: z.string().min(6, "ট্রাঞ্জেকশন নাম্বার দিন"),
  })
  .superRefine((d, ctx) => {
    if (!d.dob && !d.age) {
      ctx.addIssue({ code: "custom", message: "জন্ম তারিখ বা বয়স দিন", path: ["dob"] });
      ctx.addIssue({ code: "custom", message: "জন্ম তারিখ বা বয়স দিন", path: ["age"] });
    }
  });

type FormValues = z.infer<typeof schema>;

export default function GoogleStyleSeminarForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), mode: "onChange" });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    alert("✅ যাচাই সম্পন্ন (ডেমো ফ্রন্টএন্ড)।");
    reset();
  };

  const card = "bg-white rounded-md border border-[#dadce0]";

  const labelReq = (text: string) => (
    <div className="text-[15px] text-[#202124] font-medium">
      {text} <span className="text-[#d93025]">*</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#ede7f6]">
      {/* Top color bar */}
      <div className="h-2 w-full bg-[#673ab7]" />

      {/* Container */}
      <div className="max-w-3xl mx-auto px-4 py-6 md:py-10">
        {/* Header */}
        <div className={`${card} p-6 md:p-8`}>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#202124]">
            উম্মাহর জাগরণে করনীয় শীর্ষক সেমিনার ২০২৫
          </h1>
          <p className="text-[#5f6368] mt-2">
            এই সেমিনারে অংশগ্রহণের জন্য নিম্নের ফর্মটি পূরণ করুন ও সাবমিট করুন।
          </p>

          <div className="mt-4 h-px bg-[#dadce0]" />
          <div className="mt-4 text-sm text-[#d93025] font-medium">* Indicates required question</div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          {/* Full name */}
          <div className={`${card} p-6`}>
            {labelReq("পূর্ণ নাম:")}
            <input
              type="text"
              {...register("fullName")}
              className={`mt-2 w-full outline-none border-b transition ${
                errors.fullName ? "border-[#d93025]" : "border-[#dadce0] focus:border-[#1a73e8]"
              } bg-transparent py-2`}
              placeholder="Your answer"
            />
            {errors.fullName && <p className="text-xs text-[#d93025] mt-2">This is a required question</p>}
          </div>

          {/* DOB or Age */}
          <div className={`${card} p-6`}>
            {labelReq("জন্ম তারিখ বা বয়স:")}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <label className="text-sm text-[#5f6368]">জন্ম তারিখ</label>
                <input
                  type="date"
                  {...register("dob")}
                  className={`mt-1 w-full outline-none border-b ${
                    errors.dob ? "border-[#d93025]" : "border-[#dadce0] focus:border-[#1a73e8]"
                  } bg-transparent py-2`}
                />
                {errors.dob && <p className="text-xs text-[#d93025] mt-2">{errors.dob.message as string}</p>}
              </div>
              <div>
                <label className="text-sm text-[#5f6368]">বয়স</label>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="Your answer"
                  {...register("age")}
                  className={`mt-1 w-full outline-none border-b ${
                    errors.age ? "border-[#d93025]" : "border-[#dadce0] focus:border-[#1a73e8]"
                  } bg-transparent py-2`}
                />
                {errors.age && <p className="text-xs text-[#d93025] mt-2">{errors.age.message as string}</p>}
              </div>
            </div>
          </div>

          {/* Phone */}
          <div className={`${card} p-6`}>
            {labelReq(
              "মোবাইল নাম্বার: ( এমন নাম্বার লিখুন যেটাতে হোয়াটসঅ্যাপ আইডি খুলা আছে। আর না থাকলে রেগুলার ব্যবহৃত নাম্বার লিখুন )"
            )}
            <input
              type="tel"
              placeholder="Your answer"
              {...register("phone")}
              className={`mt-2 w-full outline-none border-b ${
                errors.phone ? "border-[#d93025]" : "border-[#dadce0] focus:border-[#1a73e8]"
              } bg-transparent py-2`}
            />
            {errors.phone && <p className="text-xs text-[#d93025] mt-2">This is a required question</p>}
          </div>

          {/* Email */}
          <div className={`${card} p-6`}>
            {labelReq("ইমেইল ঠিকানা:")}
            <input
              type="email"
              placeholder="Your answer"
              {...register("email")}
              className={`mt-2 w-full outline-none border-b ${
                errors.email ? "border-[#d93025]" : "border-[#dadce0] focus:border-[#1a73e8]"
              } bg-transparent py-2`}
            />
            {errors.email && <p className="text-xs text-[#d93025] mt-2">This is a required question</p>}
          </div>

          {/* Facebook */}
          <div className={`${card} p-6`}>
            {labelReq("ফেইসবুক আইডি লিংক দিন (যদি থাকে)")}
            <input
              type="url"
              placeholder="Your answer"
              {...register("facebook")}
              className={`mt-2 w-full outline-none border-b ${
                errors.facebook ? "border-[#d93025]" : "border-[#dadce0] focus:border-[#1a73e8]"
              } bg-transparent py-2`}
            />
            {errors.facebook && <p className="text-xs text-[#d93025] mt-2">{errors.facebook.message as string}</p>}
          </div>

          {/* Address */}
          <div className={`${card} p-6`}>
            {labelReq("গ্রাম, ইউনিয়ন, থানা ও জেলা:")}
            <input
              type="text"
              placeholder="Your answer"
              {...register("address")}
              className={`mt-2 w-full outline-none border-b ${
                errors.address ? "border-[#d93025]" : "border-[#dadce0] focus:border-[#1a73e8]"
              } bg-transparent py-2`}
            />
            {errors.address && <p className="text-xs text-[#d93025] mt-2">This is a required question</p>}
          </div>

          {/* Occupation */}
          <div className={`${card} p-6`}>
            {labelReq("পেশা")}
            <input
              type="text"
              placeholder="Your answer"
              {...register("occupation")}
              className={`mt-2 w-full outline-none border-b ${
                errors.occupation ? "border-[#d93025]" : "border-[#dadce0] focus:border-[#1a73e8]"
              } bg-transparent py-2`}
            />
            {errors.occupation && <p className="text-xs text-[#d93025] mt-2">This is a required question</p>}
          </div>

          {/* Payment block (instruction style) */}
          <div className={`${card} p-6`}>
            {labelReq(
              "রেজিষ্ট্রেশন ফি (৬০০৳) প্রদান করুন ও ট্রাঞ্জেকশন নাম্বার লিখুন:  - বিকাশ এন্ড নগদ: +880 1878-952705/+8801881-550721 (সম্ভব হলে সরাসরি হোয়াটসঅ্যাপ বা নাম্বারে নক করে নিশ্চিত করুন)"
            )}
            <input
              type="text"
              placeholder="Your answer"
              {...register("paymentText")}
              className={`mt-2 w-full outline-none border-b ${
                errors.paymentText ? "border-[#d93025]" : "border-[#dadce0] focus:border-[#1a73e8]"
              } bg-transparent py-2`}
            />
            {errors.paymentText && <p className="text-xs text-[#d93025] mt-2">This is a required question</p>}
          </div>

          {/* Footer: buttons */}
          <div className="flex items-center gap-4 mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#1a73e8] text-white rounded px-6 py-2.5 font-medium hover:bg-[#1765cb] disabled:opacity-60"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={() => reset()}
              className="text-[#1a73e8] font-medium hover:bg-[#e8f0fe] rounded px-4 py-2"
            >
              Clear form
            </button>
          </div>

          <div className="text-xs text-[#5f6368] mt-6">
            Never submit passwords through Google Forms. This content is neither created nor endorsed by Google.
          </div>
        </form>
      </div>
    </div>
  );
}
