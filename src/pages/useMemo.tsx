import {useMemo,useState} from "react"
export default function UseMemoExp(){
    console.log("useMemo render")
  const [count,setCount]=useState(0);
  const [name,setName]=useState("");

  const cal = useMemo(() => {
    let total = 0;
    for(let i=0;i<1000000000;i++){
      total += count;
    }
    return total;
  }, [count]);
  return (
    <div>
      <h3>Result: {cal}</h3>
      <button onClick={() => setCount(count + 1) }  style={{backgroundColor: "black", padding: "10px 20px",color: "white",margin: "10px 0"}}>Increase count</button>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "15px",
            width: "100%",
            outline: "none",
          }} />
    </div>
  )
}