import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Scale } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email"); // 'email' or 'otp'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // API call to request OTP
      await axios.post("http://localhost:5000/api/auth/request-otp", { email });
      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // API call to verify OTP
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp });
      // Store token
      localStorage.setItem("token", res.data.token);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="flex items-center gap-2 mb-8 text-foreground">
        <Scale className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Debts Recovery Tribunal Bar Association</h1>
      </div>

      <Card className="w-full max-w-md bg-card text-card-foreground border-border">
        <CardHeader>
          <CardTitle className="text-xl">Admin Login</CardTitle>
          <CardDescription className="text-secondary-foreground/80">
            {step === "email" 
              ? "Enter your registered email to receive an OTP." 
              : `Enter the 6-digit OTP sent to ${email}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 text-sm text-destructive font-medium bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          {step === "email" ? (
            <form onSubmit={handleRequestOTP} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium leading-none">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@legalassoc.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent border-input"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Request OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="otp" className="text-sm font-medium leading-none">
                  One-Time Password
                </label>
                <Input
                  id="otp"
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="bg-transparent border-input font-mono tracking-widest text-center text-lg"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Secure Login"}
              </Button>
              <div className="text-center mt-2">
                <button 
                  type="button" 
                  onClick={() => setStep("email")}
                  className="text-sm text-secondary-foreground hover:text-foreground underline decoration-dashed"
                >
                  Use a different email
                </button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
      
      <p className="mt-8 text-sm text-muted text-center max-w-sm">
        Only authorized administrators are permitted to access this portal. All access is logged and monitored.
      </p>
    </div>
  );
}
