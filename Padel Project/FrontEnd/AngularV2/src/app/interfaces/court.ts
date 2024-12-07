export interface Court {
  name: string,
  company_id: number,
  price_hour: number,
  type_floor: string,
  status: string,
  illumination: number,
  cover: number,
  last_maintenance: string,
  shower_room: number,
  lockers: number,
  rent_equipment: number,
  file_path: File | null;
  schedules: {
    weekdays: { opening_time: string, closing_time: string, is_closed: number },
    saturday: { opening_time: string, closing_time: string, is_closed: number},
    sunday: { opening_time: string, closing_time: string, is_closed: number }
  }
}
