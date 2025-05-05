



export const getJobById = async(id)=>{
    const res=await fetch("http://localhost:3000/jobs");
    const jobs=await res.json();
    return jobs.find(x=> x.id==id);
}