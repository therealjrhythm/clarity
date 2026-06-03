"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function getRedirectPath(formData: FormData) {
  const next = formData.get("next");
  return typeof next === "string" && next.startsWith("/") ? next : "/dashboard";
}

function getName(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  return name ? name.split(/\s+/)[0] : "";
}

function getLastName(formData: FormData) {
  return String(formData.get("lastName") || "").trim();
}

function getNameMetadata(formData: FormData) {
  const firstName = getName(formData);
  const lastName = getLastName(formData);
  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  return {
    firstName,
    fullName,
    lastName,
  };
}

export async function signIn(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect("/login?error=Supabase%20is%20not%20configured");
  }

  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const { firstName, fullName, lastName } = getNameMetadata(formData);
  const next = getRedirectPath(formData);
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  if (firstName || lastName) {
    const profileData: Record<string, string> = {};
    if (firstName) {
      profileData.first_name = firstName;
    }
    if (lastName) {
      profileData.last_name = lastName;
    }
    if (fullName) {
      profileData.full_name = fullName;
      profileData.name = fullName;
    }

    await supabase.auth.updateUser({
      data: profileData,
    });
  }

  redirect(next);
}

export async function signUp(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect("/signup?error=Supabase%20is%20not%20configured");
  }

  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const { firstName, fullName, lastName } = getNameMetadata(formData);
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        full_name: fullName || firstName || lastName,
        last_name: lastName,
        name: fullName || firstName || lastName,
      },
    },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}

export async function signOut() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  redirect("/");
}
