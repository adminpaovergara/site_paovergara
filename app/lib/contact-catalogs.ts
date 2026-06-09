import type { Locale } from "@/app/lib/i18n";
import { supabaseRest } from "@/app/lib/supabase-rest";

export type ContactCountry = {
  value: string;
  dial: string;
  flag: string;
  label: Record<Locale, string>;
};

export type ContactOption = {
  value: string;
  label: Record<Locale, string>;
};

export type ContactCatalogs = {
  countries: ContactCountry[];
  projectTypes: ContactOption[];
  urgencyOptions: ContactOption[];
  contactOptions: ContactOption[];
};

type CountryRow = {
  code: string;
  name_es: string;
  name_en: string;
  dial_code: string;
  flag: string;
};

type OptionRow = {
  value: string;
  label_es: string;
  label_en: string;
};

async function fetchTable<T>(table: string, select: string) {
  return supabaseRest<T[]>({
    path: `${table}?select=${select}&active=eq.true&order=order_index.asc`,
    revalidate: 300
  });
}

function mapOption(row: OptionRow): ContactOption {
  return {
    value: row.value,
    label: {
      es: row.label_es,
      en: row.label_en
    }
  };
}

export async function getContactCatalogs(): Promise<ContactCatalogs> {
  const [countries, projectTypes, urgencyOptions, contactOptions] = await Promise.all([
    fetchTable<CountryRow>("countries", "code,name_es,name_en,dial_code,flag"),
    fetchTable<OptionRow>("project_types", "value,label_es,label_en"),
    fetchTable<OptionRow>("urgency_options", "value,label_es,label_en"),
    fetchTable<OptionRow>("contact_preferences", "value,label_es,label_en")
  ]);

  return {
    countries: countries.map((country) => ({
      value: country.code,
      dial: country.dial_code,
      flag: country.flag,
      label: {
        es: country.name_es,
        en: country.name_en
      }
    })),
    projectTypes: projectTypes.map(mapOption),
    urgencyOptions: urgencyOptions.map(mapOption),
    contactOptions: contactOptions.map(mapOption)
  };
}
