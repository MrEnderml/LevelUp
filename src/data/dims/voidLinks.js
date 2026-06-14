import { ref } from "vue"
export const links = ref([

    // VOID
    //right
    { id: 1, from: "vs_1", to: "vs_2" },
    { id: 2, from: "vs_2", to: "vs_3" },
    { id: 3, from: "vs_3", to: "vs_4" },
    { id: 4, from: "vs_4", to: "vs_5" },
    //bottom
    { id: 101, from: "vs_1", to: "vs_101" },
    { id: 102, from: "vs_101", to: "vs_102" },
    { id: 103, from: "vs_102", to: "vs_103" },
    //left
    { id: 201, from: "vs_1", to: "vs_201" },
    { id: 202, from: "vs_201", to: "vs_202" },
    { id: 203, from: "vs_202", to: "vs_203" },
    { id: 204, from: "vs_203", to: "vs_204" },
    //top
    { id: 301, from: "vs_1", to: "vs_301" },
    { id: 302, from: "vs_301", to: "vs_302" },
    { id: 303, from: "vs_302", to: "vs_303" },
    { id: 304, from: "vs_303", to: "vs_304" },
  
    // TO RESOURCES
    { id: 31, from: "vs_4", to: "res_1" },
    { id: 32, from: "vs_4", to: "res_2" },
    { id: 33, from: "vs_4", to: "res_3" },
    { id: 34, from: "vs_4", to: "res_4" },
    { id: 35, from: "vs_4", to: "res_5" },
  
    { id: 41, from: "vs_5", to: "res_6" },
    { id: 42, from: "vs_5", to: "res_7" },
    { id: 43, from: "vs_5", to: "res_8" },
  
    // COST
    { id: 302, from: "vs_302", to: "cost_1" },
    { id: 303, from: "vs_303", to: "cost_2" },
  
    // LAW
    { id: 121, from: "vs_102", to: "law_1" },
    { id: 122, from: "vs_102", to: "law_2" },
    { id: 123, from: "law_2", to: "law_3" },
    { id: 124, from: "law_3", to: "law_4" },
  
    { id: 1211, from: "law_1", to: "law_11" },
  
  
    // SINGULARITY
    { id: 131, from: "vs_103", to: "sing_1" },
    { id: 132, from: "vs_103", to: "sing_2" },
    { id: 133, from: "vs_103", to: "sing_3" },
  
    { id: 1311, from: "sing_1", to: "sing_4" },
    { id: 1331, from: "sing_3", to: "sing_5" },
  
    { id: 1312, from: "sing_4", to: "sing_6" },
    { id: 1332, from: "sing_5", to: "sing_6" },
    { id: 1321, from: "sing_2", to: "sing_6" },
  
  
    // INFINITY
    { id: 231, from: "vs_203", to: "inf_1" },
    { id: 232, from: "vs_203", to: "inf_2" },
  
    { id: 3311, from: "inf_2", to: "inf_3" },
    { id: 33111, from: "inf_3", to: "inf_4" },
    { id: 331111, from: "inf_4", to: "inf_5" },
  
    { id: 3321, from: "inf_1", to: "inf_6" },
  
    // QUASAR
    { id: 231, from: "vs_203", to: "qua_1" },
    { id: 2311, from: "qua_1", to: "qua_2" },
  
    // ABYSS
    { id: 241, from: "vs_204", to: "abyss_1" },
    { id: 2411, from: "abyss_1", to: "abyss_2" }
  
  ])