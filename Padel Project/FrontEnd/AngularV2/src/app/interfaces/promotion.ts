export interface Promotion {
  description: string;
  promo_code: string;
  usage_limit: number;
  min_spend: number;
  discount: number;
  for_inactive_users: boolean;
  for_new_users: boolean;
  additional_info?: string | null;
  start_date: string;
  end_date: string;
  generic: boolean;
  active: boolean;
}
