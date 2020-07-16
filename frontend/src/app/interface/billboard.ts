export interface Billboard {
  expire: string;
  items: BillboardItem[];
  marquee: string;
}
export interface BillboardItem {
  content: string;
  img: string;
  menu: string;
  name: string;
}
