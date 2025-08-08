import { Heart, Phone, MapPin, Clock, Shield } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { AppConfig } from '@/utils/AppConfig';

import { Logo } from './Logo';

export const Footer = () => {
  const t = useTranslations('Footer');

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto py-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Hospital Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Logo />
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <MapPin className="size-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="font-medium">Sanjeevani Hospital & Medical Centre</p>
                  <p className="text-muted-foreground">
                    Plot No. 45, Medical Complex<br />
                    Shivaji Nagar, Pune<br />
                    Maharashtra - 411005
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Phone className="size-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-red-600">Emergency: 108</p>
                  <p className="font-medium text-orange-600">Ambulance: 102</p>
                  <p className="text-muted-foreground">Reception: +91-20-2567-8901</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Clock className="size-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="font-medium">Emergency & Casualty</p>
                  <p className="text-muted-foreground">24x7 Available</p>
                  <p className="text-xs text-muted-foreground">OPD: 8:00 AM - 8:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Patient Services */}
          <div>
            <h3 className="font-bold mb-4 text-lg">Patient Services</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/dashboard/patients" className="text-muted-foreground hover:text-foreground transition-colors">
                  Patient Registration
                </Link>
              </li>
              <li>
                <Link href="/dashboard/appointments" className="text-muted-foreground hover:text-foreground transition-colors">
                  OPD Appointment
                </Link>
              </li>
              <li>
                <Link href="/dashboard/medical-records" className="text-muted-foreground hover:text-foreground transition-colors">
                  Medical Records
                </Link>
              </li>
              <li>
                <Link href="/dashboard/billing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Billing & Ayushman Bharat
                </Link>
              </li>
              <li>
                <Link href="/dashboard/government-schemes" className="text-muted-foreground hover:text-foreground transition-colors">
                  Government Schemes
                </Link>
              </li>
            </ul>
          </div>

          {/* Hospital Resources */}
          <div>
            <h3 className="font-bold mb-4 text-lg">Medical Departments</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/dashboard/departments" className="text-muted-foreground hover:text-foreground transition-colors">
                  General Medicine
                </Link>
              </li>
              <li>
                <Link href="/dashboard/emergency" className="text-muted-foreground hover:text-foreground transition-colors">
                  Emergency & Casualty
                </Link>
              </li>
              <li>
                <Link href="/dashboard/lab-results" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pathology Lab
                </Link>
              </li>
              <li>
                <Link href="/dashboard/pharmacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pharmacy
                </Link>
              </li>
              <li>
                <Link href="/dashboard/departments" className="text-muted-foreground hover:text-foreground transition-colors">
                  Gynecology & Pediatrics
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h3 className="font-bold mb-4 text-lg">Accreditation & Legal</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/patient-rights" className="text-muted-foreground hover:text-foreground transition-colors">
                  Patient Rights & Charter
                </Link>
              </li>
              <li>
                <Link href="/nabh-compliance" className="text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1">
                  <Shield className="size-3" />
                  <span>NABH Standards</span>
                </Link>
              </li>
              <li>
                <Link href="/clinical-establishment-act" className="text-muted-foreground hover:text-foreground transition-colors">
                  Clinical Establishment Act
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact & Feedback
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Emergency Banner */}
        <div className="mt-8 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-red-700 dark:text-red-400">
            <div className="flex items-center space-x-2">
              <Heart className="size-5 text-red-600" />
              <span className="font-medium">24x7 Emergency & Casualty Services</span>
            </div>
            <div className="flex items-center space-x-4 text-sm sm:text-base">
              <span className="font-bold">Emergency: 108</span>
              <span className="font-bold">|</span>
              <span className="font-bold">Ambulance: 102</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2024 Sanjeevani Hospital & Medical Centre. All rights reserved.</p>
          <p className="mt-1">NABH Accredited | Clinical Establishment Act Compliant | Ayushman Bharat Empanelled</p>
        </div>
      </div>
    </footer>
  );
};
