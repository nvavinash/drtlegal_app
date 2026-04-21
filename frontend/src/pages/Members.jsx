import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import SectionWrapper from "../components/SectionWrapper";
import { getMembers, createMember } from "../api/members";
import Declaration from "../components/Declaration";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  CheckCircle2,
  Search,
  Phone,
  Mail,
  MapPin,
  Hash,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  X,
  UploadCloud,
  ImageIcon,
  Smartphone,
  ExternalLink,
} from "lucide-react";

/* ─── Constants ───────────────────────────────────── */
const DESKTOP_PER_PAGE = 100;
const MOBILE_PER_PAGE = 20;

/* ─── UPI QR Code (no npm needed) ─────────────────── */
function UpiQRCode({ upiLink, size = 180 }) {
  const encoded = encodeURIComponent(upiLink);
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&ecc=H`;
  return (
    <img
      src={src}
      alt="UPI QR Code"
      width={size}
      height={size}
      className="rounded-lg"
      style={{ imageRendering: "pixelated" }}
    />
  );
}

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const MEMBERSHIP_TYPES = ["PATRON MEMBER", "LIFE MEMBER", "ORDINARY MEMBER"];
const GENDER_OPTIONS = [
  "Male",
  "Female",
  "Other"
];

const MEMBERSHIP_FEES = {
  "PATRON MEMBER": "10525",
  "LIFE MEMBER": "3525",
  "ORDINARY MEMBER": "1125"
};

const INITIAL_FORM = {
  name: "",
  gender: "",
  phone: "",
  email: "",
  address: "",
  state: "Telangana",
  dob: "",
  bloodGroup: "",
  enrollmentNumber: "",
  enrollmentDate: "",
  membershipType: "ORDINARY MEMBER",
  membershipDate: "",
  membershipFee: "1000",
  transactionNumber: "",
  amountPaid: "",
  paymentTime: "",
};

/* ─── Helpers ─────────────────────────────────────── */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

function getInitials(name = "") {
  return name
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/* ─── Member Card ─────────────────────────────────── */
function MemberCard({ member }) {
  const imgSrc = member.photo
    ? `http://localhost:5000${member.photo}`
    : null;

  return (
    <div className="flex flex-col bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      {/* Avatar strip */}
      <div className="bg-gradient-to-br from-slate-700 to-slate-900 px-4 py-3 flex items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-white/20 flex-shrink-0 overflow-hidden border-2 border-white/30">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={member.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
              {getInitials(member.name)}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-amber-500 font-semibold text-md leading-tight truncate">
            {member.name}
          </p>
          <p className="text-slate-300 text-xs truncate">
            Adv. | {member.membershipType || "Member"}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="px-4 py-3 space-y-1.5 flex-1">
        {member.enrollmentNumber && (
          <div className="flex items-center gap-2 text-xs text-zinc-600">
            <Hash className="w-3 h-3 flex-shrink-0 text-zinc-400" />
            <span className="font-mono truncate">{member.enrollmentNumber}</span>
          </div>
        )}
        {member.phone && (
          <div className="flex items-center gap-2 text-xs text-zinc-600">
            <Phone className="w-3 h-3 flex-shrink-0 text-zinc-400" />
            <span>{member.phone}</span>
          </div>
        )}
        {member.email && (
          <div className="flex items-center gap-2 text-xs text-zinc-600">
            <Mail className="w-3 h-3 flex-shrink-0 text-zinc-400" />
            <span className="truncate">{member.email}</span>
          </div>
        )}
        {member.address && (
          <div className="flex items-start gap-2 text-xs text-zinc-500 mt-1">
            <MapPin className="w-3 h-3 flex-shrink-0 text-zinc-400 mt-0.5" />
            <span className="line-clamp-2">{member.address.toUpperCase()}</span>
          </div>
        )}   
      </div>
    </div>
  );
}

/* ─── Payment Gate ────────────────────────────────── */
function PaymentGate({ isMobile, onConfirmed, onClose, upiId, upiPayee }) {
  const [memType, setMemType] = useState("");
  const amount = memType ? MEMBERSHIP_FEES[memType] : "";
  const targetUpiId = upiId || "8299177208@upi";
  const targetPayee = upiPayee || "DRT BAR ASSOCIATION";
  
  const generatedUpiLink = memType 
    ? `upi://pay?pa=${targetUpiId}&pn=${targetPayee}&am=${amount}&cu=INR`
    : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-white font-bold text-lg">Membership Payment</h2>
            <p className="text-slate-300 text-sm">Complete payment to register</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* Membership Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-zinc-700 mb-2">
              Select Membership Type First <span className="text-red-500">*</span>
            </label>
            <select
              value={memType}
              onChange={(e) => setMemType(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-zinc-300 bg-zinc-50 text-sm text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-500 transition-shadow"
            >
              <option value="" disabled>Select Type...</option>
              {MEMBERSHIP_TYPES.map(type => (
                <option key={type} value={type}>
                  {type} — ₹{MEMBERSHIP_FEES[type]}
                </option>
              ))}
            </select>
          </div>

          {!memType ? (
            <div className="py-12 bg-zinc-50 border border-dashed border-zinc-200 rounded-xl flex flex-col items-center justify-center text-center">
              <CreditCard className="w-10 h-10 text-zinc-300 mb-3" />
              <p className="text-sm font-medium text-zinc-500 max-w-[200px]">
                Please select a membership type to generate payment details.
              </p>
            </div>
          ) : (
            <>
              {isMobile ? (
                /* Mobile: button + link */
                <div className="flex flex-col items-center gap-5 py-4">
                  <div className="text-center mb-2">
                    <p className="text-sm text-zinc-500 mb-1">Amount to pay</p>
                    <p className="text-3xl font-black text-zinc-900">₹{amount}</p>
                  </div>
                  <a
                    href={generatedUpiLink}
                    className="w-full text-center bg-slate-800 hover:bg-slate-900 text-white font-semibold py-4 px-6 rounded-xl transition-colors shadow-lg shadow-slate-900/20 text-lg flex items-center justify-center gap-2"
                  >
                    <Smartphone className="w-5 h-5" /> Pay Now via App
                  </a>
                  <a
                    href={generatedUpiLink}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open UPI link manually
                  </a>
                  <p className="text-xs text-zinc-400 mt-1 text-center">
                    UPI ID: <span className="font-mono font-medium text-zinc-600">{targetUpiId}</span>
                  </p>
                </div>
              ) : (
                /* Desktop: QR code */
                <div className="flex flex-col items-center gap-4 py-2">
                  <div className="w-56 h-56 bg-zinc-50 border-2 border-dashed border-zinc-300 rounded-2xl flex flex-col items-center justify-center p-4">
                    <UpiQRCode upiLink={generatedUpiLink} size={180} />
                  </div>
                  <div className="text-center bg-zinc-50 px-6 py-3 rounded-xl border border-zinc-100 w-full">
                    <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1">Scan to Pay</p>
                    <p className="text-2xl font-black text-zinc-900 mb-2">₹{amount}</p>
                    <p className="text-sm font-medium text-zinc-700 font-mono bg-white border border-zinc-200 px-3 py-1 rounded inline-block">
                      {targetUpiId}
                    </p>
                    <p className="text-xs text-zinc-400 mt-2">Payee: {targetPayee}</p>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="border-t border-zinc-100 mt-6 pt-5 flex flex-col gap-3">
            <p className="text-sm text-zinc-600 text-center font-medium">
              After successful payment, click below.
            </p>
            <Button 
              className="w-full h-12 text-base font-bold" 
              onClick={() => onConfirmed(memType)}
              disabled={!memType}
            >
              <CheckCircle2 className="w-5 h-5 mr-2" /> I Have Paid — Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Field & Select helpers (defined OUTSIDE to avoid focus-loss bug) ─── */
function Field({ label, name, type = "text", required, placeholder, children, form, errors, handleChange }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-zinc-600 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children ?? (
        <Input
          name={name}
          type={type}
          value={form[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className={`text-sm h-9 ${errors[name] ? "border-red-400 focus-visible:ring-red-400" : ""}`}
        />
      )}
      {errors[name] && <p className="text-xs text-red-500 mt-0.5">{errors[name]}</p>}
    </div>
  );
}

function FormSelect({ label, name, required, options, form, handleChange }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-zinc-600 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={form[name]}
        onChange={handleChange}
        className="w-full h-9 px-3 rounded-md border border-zinc-200 bg-white text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
      >
        {options.map((o) => (
          <option key={o.value ?? o} value={o.value ?? o}>
            {o.label ?? o}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ─── Registration Form ───────────────────────────── */
function RegistrationForm({ prefillType, onSuccess, onClose }) {
  const [form, setForm] = useState({
    ...INITIAL_FORM, 
    membershipType: prefillType || INITIAL_FORM.membershipType,
    membershipFee: MEMBERSHIP_FEES[prefillType || INITIAL_FORM.membershipType]
  });
  const [photo, setPhoto] = useState(null);
  const [photoError, setPhotoError] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "membershipType") {
      setForm((prev) => ({ 
        ...prev, 
        [name]: value,
        membershipFee: MEMBERSHIP_FEES[value]
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePhoto = (e) => {
    setPhotoError("");
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "image/jpeg") {
      setPhotoError("Only JPEG images are allowed.");
      return;
    }
    if (file.size > 100 * 1024) {
      setPhotoError("File size must be under 100KB.");
      return;
    }
    setPhoto(file);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim()) e.phone = "Mobile number is required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.transactionNumber.trim()) e.transactionNumber = "Transaction number is required";
    if (!form.amountPaid.trim()) e.amountPaid = "Amount paid is required";
    if (!form.paymentTime.trim()) e.paymentTime = "Payment time is required";
    if (!photo) e.photo = "Passport photo is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => v && data.append(k, v));
      data.append("photo", photo);
      await createMember(data);
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm">
      <div className="min-h-full flex items-start justify-center p-4 pt-8 pb-20">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 rounded-t-2xl flex items-center justify-between sticky top-0">
            <div>
              <h2 className="text-white font-bold text-lg">Membership Registration</h2>
              <p className="text-slate-300 text-xs mt-0.5">All fields marked * are required</p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition p-1 rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Section: Personal Info */}
            <div>
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Advocate Name" name="name" required placeholder="Full name" form={form} errors={errors} handleChange={handleChange} />
                <FormSelect
                  label="Gender"
                  name="gender"
                  form={form}
                  handleChange={handleChange}
                  options={[
                    { value: "", label: "Select gender" },
                    ...GENDER_OPTIONS
                  ]}
                />
                <Field label="Mobile Number" name="phone" required placeholder="+91 98765 43210" form={form} errors={errors} handleChange={handleChange} />
                <Field label="Email" name="email" type="email" placeholder="advocate@example.com" form={form} errors={errors} handleChange={handleChange} />
                <Field label="Date of Birth" name="dob" type="date" form={form} errors={errors} handleChange={handleChange} />
                <FormSelect
                  label="Blood Group"
                  name="bloodGroup"
                  form={form}
                  handleChange={handleChange}
                  options={[{ value: "", label: "Select" }, ...BLOOD_GROUPS]}
                />
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Address" name="address" required placeholder="Full address" form={form} errors={errors} handleChange={handleChange}>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Full address"
                    className={`w-full px-3 py-2 rounded-md border text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none ${
                      errors.address ? "border-red-400" : "border-zinc-200"
                    }`}
                  />
                  {errors.address && (
                    <p className="text-xs text-red-500 mt-0.5">{errors.address}</p>
                  )}
                </Field>
                <Field label="State" name="state" placeholder="Telangana" form={form} errors={errors} handleChange={handleChange} />
              </div>
            </div>

            {/* Section: Enrollment */}
            <div>
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">
                Enrollment Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Enrollment Number" name="enrollmentNumber" placeholder="TS/1234/2023" form={form} errors={errors} handleChange={handleChange} />
                <Field label="Enrollment Date" name="enrollmentDate" type="date" form={form} errors={errors} handleChange={handleChange} />
              </div>
            </div>

            {/* Section: Membership */}
            <div>
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">
                Membership Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormSelect
                  label="Membership Type"
                  name="membershipType"
                  form={form}
                  handleChange={handleChange}
                  options={MEMBERSHIP_TYPES}
                />
                <Field label="Membership Date" name="membershipDate" type="date" form={form} errors={errors} handleChange={handleChange} />
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 mb-1">Membership Fee (₹)</label>
                  <input
                    readOnly
                    name="membershipFee"
                    value={form.membershipFee}
                    className="w-full text-sm h-9 px-3 bg-zinc-100 text-zinc-500 border border-zinc-200 rounded-md cursor-not-allowed outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section: Payment */}
            <div>
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" /> Payment Details
              </h3>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-amber-700 font-medium">
                  These fields are mandatory. Please enter exact details from your UPI receipt.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field
                  label="Transaction Number"
                  name="transactionNumber"
                  required
                  placeholder="UPI Ref / Transaction ID"
                  form={form} errors={errors} handleChange={handleChange}
                />
                <Field
                  label="Amount Paid (₹)"
                  name="amountPaid"
                  required
                  placeholder="e.g. 500"
                  form={form} errors={errors} handleChange={handleChange}
                />
                <Field
                  label="Payment Time"
                  name="paymentTime"
                  type="datetime-local"
                  required
                  form={form} errors={errors} handleChange={handleChange}
                />
              </div>
            </div>

            {/* Section: Photo */}
            <div>
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">
                Passport Photo
              </h3>
              <div
                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center text-center cursor-pointer transition hover:bg-zinc-50 relative ${
                  errors.photo || photoError
                    ? "border-red-400 bg-red-50"
                    : "border-zinc-300"
                }`}
              >
                <input
                  type="file"
                  accept="image/jpeg"
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  onChange={handlePhoto}
                />
                {photo ? (
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon className="w-8 h-8 text-emerald-500" />
                    <p className="text-sm font-medium text-zinc-700">{photo.name}</p>
                    <p className="text-xs text-zinc-400">
                      {(photo.size / 1024).toFixed(1)} KB — Click to change
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <UploadCloud className="w-8 h-8 text-zinc-400" />
                    <p className="text-sm font-medium text-zinc-600">
                      Click to upload passport photo
                    </p>
                    <p className="text-xs text-zinc-400">
                      JPEG only · Max 100KB · 600×800 px recommended
                    </p>
                  </div>
                )}
              </div>
              {(photoError || errors.photo) && (
                <p className="text-xs text-red-500 mt-1">{photoError || errors.photo}</p>
              )}
            </div>
            <div>
              <Declaration />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-100">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="min-w-[140px]">
                {loading ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ─── Success Modal ───────────────────────────────── */
function SuccessModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">Application Submitted!</h2>
        <p className="text-zinc-500 text-sm mb-6">
          Your membership application has been received and is pending admin approval.
          You will be added to the directory once approved.
        </p>
        <Button className="w-full" onClick={onClose}>
          Back to Directory
        </Button>
      </div>
    </div>
  );
}

/* ─── Pagination ──────────────────────────────────── */
function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-lg border border-zinc-200 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <div className="flex gap-1">
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (page <= 3) {
            pageNum = i + 1;
          } else if (page >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = page - 2 + i;
          }
          return (
            <button
              key={pageNum}
              onClick={() => onPage(pageNum)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                page === pageNum
                  ? "bg-slate-800 text-white"
                  : "border border-zinc-200 hover:bg-zinc-50 text-zinc-700"
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>
      <button
        onClick={() => onPage(page + 1)}
        disabled={page === totalPages}
        className="p-2 rounded-lg border border-zinc-200 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────── */
const Members = () => {
  const isMobile = useIsMobile();
  const perPage = isMobile ? MOBILE_PER_PAGE : DESKTOP_PER_PAGE;

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [virtualSettings, setVirtualSettings] = useState({});

  // Modal states
  const [showPayment, setShowPayment] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedMemType, setSelectedMemType] = useState("");

  useEffect(() => {
    fetchMembers();
    fetchVirtualSettings();
  }, []);

  const fetchVirtualSettings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/virtual");
      setVirtualSettings(res.data || {});
    } catch (err) {
      console.error("Failed to fetch virtual settings");
    }
  };

  // Reset to page 1 on search
  useEffect(() => {
    setPage(1);
  }, [search]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const data = await getMembers();
      setMembers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return members;
    return members.filter((m) => m.name?.toLowerCase().includes(q));
  }, [members, search]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handlePaymentConfirmed = (memType) => {
    setSelectedMemType(memType);
    setShowPayment(false);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
  };

  const handleRegisterClick = () => {
    setShowPayment(true);
  };

  return (
    <>
      {/* Modals */}
      {showPayment && (
        <PaymentGate
          isMobile={isMobile}
          upiId={virtualSettings.upi_id}
          upiPayee={virtualSettings.upi_payee}
          onConfirmed={handlePaymentConfirmed}
          onClose={() => setShowPayment(false)}
        />
      )}
      {showForm && (
        <RegistrationForm
          prefillType={selectedMemType}
          onSuccess={handleFormSuccess}
          onClose={() => setShowForm(false)}
        />
      )}
      {showSuccess && <SuccessModal onClose={handleSuccessClose} />}

      <SectionWrapper className="!py-10">
        {/* Page Header */}
        {/* <div className="mt-35  flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"> */}
        <div className="mt-10 mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0">

          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900">
              Member Directory
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Registered advocates of DRT Bar Association, Hyderabad
            </p>
          </div>
          <Button
            id="register-member-btn"
            size="sm"
            className="flex items-center gap-2 shrink-0"
            onClick={handleRegisterClick}
          >
            <UserPlus className="w-4 h-4" />
            Become a Member
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          <input
            id="member-search"
            type="text"
            placeholder="Search members by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-zinc-200 rounded-xl bg-white text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-slate-400 transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Stats bar */}
        {!loading && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-zinc-500">
              {search
                ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""} for "${search}"`
                : `${members.length} approved member${members.length !== 1 ? "s" : ""}`}
            </p>
            {totalPages > 1 && (
              <p className="text-xs text-zinc-400">
                Page {page} of {totalPages}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: isMobile ? 4 : 8 }).map((_, i) => (
              <div
                key={i}
                className="h-40 bg-zinc-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div className="py-24 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
              <Search className="w-7 h-7 text-zinc-300" />
            </div>
            <p className="text-zinc-500 font-medium">
              {search ? "No members match your search." : "No approved members yet."}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-3 text-sm text-blue-600 hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {paginated.map((m) => (
                <MemberCard key={m._id} member={m} />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onPage={setPage} />
          </>
        )}
      </SectionWrapper>
    </>
  );
};

export default Members;
