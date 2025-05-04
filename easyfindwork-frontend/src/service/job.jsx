
export const getJobWithLocation= (location)=>{
    return fetch("http://localhost:3000/jobs")
    .then(res=> res.json())
    .then(jobs=> jobs.filter(x=> x.location===location));
}
