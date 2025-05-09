
export const getJobById = async(id)=>{
    const res=await fetch("http://localhost:3000/jobs");
    const jobs=await res.json();
    return jobs.find(x=> x.id==id);
}

export const getIndustryJobIsActive = async () => {
    try {
      const res = await fetch("http://localhost:3000/jobs");
      const data = await res.json();
      
      let jobIndustry = data.map(x => x.industry);
      let industry = [];
  
      if (jobIndustry.length > 0) {
        jobIndustry.forEach(ele => {
          let temp = ele.split(", ");
          temp.forEach(item => {
            if (!industry.includes(item)) {
              industry.push(item);
            }
          });
        });
      }
      industry.sort();
      return industry;
    } catch (error) {
      console.error("Lỗi fetch industry:", error);
      return []; 
    }
  };
  

//   export const getAllJobByIndustry=async (industry)=>{
//     try {
//         const res= await fetch("http://localhost:3000/jobs");
//         const result= await res.json();
//         return result.filter(x=> {
//             const industries = x.industry.split(",").map(i => i.trim().toLowerCase());
//             return industries.some((i) => i == industry);
//         })
//     } catch (error) {
//         console.error("Lỗi Fetch");
//         return [];
//     }
//   }

  export const getAllJobByIndustry = async (industry) => {
    try {
      const res = await fetch("http://localhost:3000/jobs");
      const result = await res.json();
  
      const normalizedIndustry = industry.trim().toLowerCase();
  
      return result.filter((job) => {
        const industries = job.industry
          .split(",")
          .map((i) => i.trim().toLowerCase());
        return industries.includes(normalizedIndustry);
      });
    } catch (error) {
      console.error("Lỗi Fetch:", error);
      return [];
    }
  };
  