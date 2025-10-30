import React, { useState, memo } from "react";
interface ChildProps {
  name: string;
}
const Child = memo(({ name }: ChildProps) => {
    console.log("Child render");
    return <div>Hí {name}</div>
})

function MemoExp(){
    const [count,setCount]=useState(0);
    const [name,setName]=useState("");
    return (
        <div>
        <h1>Memo</h1>
        <h3>Count: {count}</h3>
        <button onClick={() => setCount(count + 1)}>Increase count</button>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "15px",
            width: "100%",
            outline: "none",
          }}/>
        <Child name={name} />
        </div>
    )
}
export default MemoExp;