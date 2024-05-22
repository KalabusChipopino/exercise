interface ButtonMainProps {
    text: string; 
    onClick?: () => void; 
    active?: boolean; 
  }
export default function ButtonMain( {text, active, onClick}: ButtonMainProps ) {
    return <button className={`border-[1px] border-border py-1 px-1.5 /
      ${ active ? 'shadow-[inset_1px_1px_2px_rgba(0,0,0,0.6)]' : 'shadow-[1px_1px_2px_rgba(0,0,0,0.6)]'}`}>
        {text}
    </button>
}