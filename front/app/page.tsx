import Image from "next/image";
import ExerciseCard from "./components/ExerciseCard";
import ButtonMain from "./components/buttonsUi/ButtonMain";

export default function Home() {
  return (
    <main className="flex flex-col px-[5vw] pt-2.5 gap-[10px]">
      <div className="flex w-full justify-between ">
        <h1 className="text-[22px]">
          Main Title
        </h1>
        <div className="flex gap-1">
          <ButtonMain text="Recent" active={true}/>
          <ButtonMain text="Top" active={false}/>
        </div>
      </div>
      <div className="flex mt-5 justify-between gap-2.5 flex-wrap">
      {Array(10).fill(0).map((e, index)=> <ExerciseCard key={index}/>)}
      </div>
    </main>
  );
}
