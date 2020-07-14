export interface Billboard {
  expire: string;
  items: BillboardItem[];
}
export interface BillboardItem {
  content: string;
  img: string;
  menu: string;
  name: string;
}
