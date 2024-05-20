import Image from "next/image";
import CardMain from "./components/CardMain";

export default function Home() {
  return (
    <main className=" px-[5vw] pt-[10px]">
      <div className="flex w-full justify-between">
        <h1 className="text-[22px]">
          Title
        </h1>
        buttons
      </div>
      <div className="flex justify-between mt-[20px]">
        <CardMain/>
        <CardMain/>
      </div>
    </main>
  );
}
