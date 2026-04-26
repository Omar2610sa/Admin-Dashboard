import React from 'react'

import useFetch from '../../Hooks/useFetch';

// Material UI Icons
import LayersIcon from '@mui/icons-material/Layers';
import LanguageIcon from '@mui/icons-material/Language';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import HouseIcon from '@mui/icons-material/House';
import MessageIcon from '@mui/icons-material/Message';
import ContactsIcon from '@mui/icons-material/Contacts';

import { useNavigate } from "react-router-dom";

const DashboardCard = () => {

    const navigate = useNavigate();

    const icons = [
        { icon: <LayersIcon /> },
        { icon: <LayersIcon /> },
        { icon: <AutoAwesomeIcon /> },
        { icon: <AutoAwesomeIcon /> },
        { icon: <LanguageIcon /> },
        { icon: <LanguageIcon /> },
        { icon: <HouseIcon /> },
        { icon: <HouseIcon /> },
        { icon: <MessageIcon /> },
        { icon: <MessageIcon /> },
        { icon: <ContactsIcon /> },
        { icon: <ContactsIcon /> },
    ]

    const { data: DashCard } = useFetch("/api/admin/statistics");

    console.log(DashCard)
    return (
        
        <div className='grid grid-row-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {
                Array.isArray(DashCard) && DashCard.length > 0 ? (
                    DashCard.map((card, index) => {
                        return (
                            <div key={card?.id || index} onClick={() => navigate(`/app${card.to}`)} className="bg-white dark:bg-slate-800 rounded-2xl p-6  shadow-xl border hover:scale-103 duration-300  border-slate-100 dark:border-slate-700 cursor-pointer">
                                <div className="flex flex-col items-start justify-center gap-4">
                                    <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white flex justify-center items-center  rounded-xl">
                                        {icons[index]?.icon}
                                    </div>
                                        <p className=" font-medium text-slate-600 dark:text-slate-400">{card?.title}</p>
                                        <p className="text-3xl font-black text-slate-800 dark:text-white">{card?.total}</p>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="text-center py-8">
                        <p className="text-slate-600 dark:text-slate-400">جاري تحميل البيانات...</p>
                    </div>
                )
            }
        </div>
    )
}

export default DashboardCard