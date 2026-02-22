**Live Link Deployed on Vercel: ** https://assignment-charts.vercel.app/


<img width="1818" height="849" alt="image" src="https://github.com/user-attachments/assets/770ed559-8b5f-41aa-a146-3ac830346421" />
<img width="1765" height="789" alt="image" src="https://github.com/user-attachments/assets/d05a628b-4577-4514-8056-6c5aab7c7773" />



**Step-1: Created the project using react+typescript+npm**

    *) npm create vite@latest proj
    *) cd proj
    *) npm i
    *) npm i echarts 

Step-2: Downloaded CSV file and placed inside public/dataset.csv and did following things:

    *) Parsed the CSV in json format: used AI help for this
    *) Selected unique cities, years, and fuel type to show in dropdown options

Step-3: Created useEffect hooks, regular functions like monthly average calculation

    *)  3 useState state variables for storing current selected year, selected city and selected fuel
    *)  Event change on select changes these selected react states
    *) used useEffect react hook to trigger the monthlyAverage if any changes happens in react state

Step-4: UI & heavy computation

    *) useMemo react hook used to store the result of heavy cimputation so that we don't need to creat the funtion on every render
    *) useRef is used as Apache ECharts is not a react componet and need html dom access

    *) For UI: used display: flex as it's best in case of 1D eles data arrangement
