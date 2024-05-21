import Image from "next/image";
import CardMain from "./components/CardMain";

export default function Home() {
  return (
    <main className="flex flex-col px-[5vw] pt-[10px] gap-[10px]">
      <div className="flex w-full justify-between ">
        <h1 className="text-[22px]">
          Title
        </h1>
        buttons
      </div>
      <div className="flex mt-[20px] gap-[10px] flex-wrap">
        <CardMain/>
        <CardMain/>
        <CardMain/>
      </div>
    </main>
  );
}
