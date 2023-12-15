import { useEffect, useCallback, useState } from 'react'
import axiosInstance from '../axiosConfig'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import ReferralCreate from '../components/referral/ReferralCreate'
import { XMarkIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/20/solid'
import MenuViewOptionsDropdown from '../components/custom/MenuViewOptionsDropdown'
import { Loading } from '../components/custom/Loading'
import ReferralActivity from '../components/referral/ReferralActivity'

const referralStatuses = {
    "Requested": "bg-blue-50 text-blue-700  ring-blue-600/20",
    "Completed": "bg-green-50 text-green-700  ring-green-600/20",
    "In review": "bg-green-50 text-green-700  ring-green-600/20",
}

const referralAction = (resumes, essay, contact) => {
    console.log(resumes, essay, contact);
    if (!(resumes || essay || contact)) {
        return "Please upload your resume, essay and contact before requesting."
    }
    else if (!(resumes || essay)) {
        return "Please upload your resume and essay."
    }
    else if (!(resumes || contact)) {
        return "Please upload your resume and contact."
    }
    else if (!(essay || contact)) {
        return "Please upload your essay and contact."
    }
    else if (!resumes) {
        return "Please upload your resume"
    }
    else if (!essay) {
        return "Please upload your essay."
    }
    else if (!contact) {
        return "Please upload your contact."
    } else {
        return "You have satisfied all requirements!"
    }
}

const showOptions = ["All", "Referred to", "Not referred to"]

const classNames = (...classes) => {
    return classes.filter(Boolean).join(' ')
}

const Referrals = () => {
    const { accessToken, userId } = useAuth();
    const {
        fetchReferralCompanies,
        setFetchReferralCompanies,
        referralCompanies,
        setReferralCompanies,
        resumes,
        essay,
        contact
    } = useData();

    const [shownCompanies, setShownCompanies] = useState(referralCompanies);
    const [referralCompanyId, setReferralCompanyId] = useState(null);
    const [referralIndex, setReferralIndex] = useState(null);

    const [userReferralCompanies, setUserReferralCompanies] = useState([]);

    const getReferralCompaniesRequest = useCallback(async () => {
        await axiosInstance.get("companies.referrals.list", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((response) => {
                setReferralCompanies(response.data.companies);
                console.log(response.data.companies)
            })
            .catch((error) => {
                console.log(error);
            });
    }, [accessToken, setReferralCompanies]);

    const getUserReferralCompaniesRequest = useCallback(async () => {
        await axiosInstance.get(`users.${userId}.referrals.list`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((response) => {
                setUserReferralCompanies(response.data.companies);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [accessToken, userId]);

    const handleShowReferrals = (option) => {
        switch (option) {
            case "Referred to":
                setShownCompanies(referralCompanies.filter((company) => company.referred === true))
                break
            case "Not referred to":
                setShownCompanies(referralCompanies.filter((company) => company.referred === false))
                break
            default:
                setShownCompanies(referralCompanies)
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await getReferralCompaniesRequest();
            await getUserReferralCompaniesRequest();
            setTimeout(() => setFetchReferralCompanies(false), 1000);
        }
        if (fetchReferralCompanies && accessToken) {
            fetchData();
        }
    }, [accessToken, fetchReferralCompanies, setFetchReferralCompanies, getReferralCompaniesRequest, getUserReferralCompaniesRequest]);

    return (
        <>
            <header className="flex items-center justify-between border-b border-white /5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
                <h1 className="text-base ml-4  font-semibold leading-7 text-cyan-800">Resume and Essay (Cover Letter)</h1>
            </header>

            {fetchReferralCompanies && <Loading />}

            {
                (!fetchReferralCompanies && !accessToken) &&
                <div className="flex flex-col  justify-center  h-fu96'">
                    <button
                        type="button"
                        className="mt-12 mx-auto w-36 justify-center px-3 flex rounded-full py-1 text-sm font-medium ring-1 ring-inset  bg-sky-700 text-white hover:bg-white hover:text-sky-700"
                    >
                        Log In
                    </button>

                </div>
            }

            {(!fetchReferralCompanies && accessToken) &&
                <>
                    <div className="lg:pr-96">

                        <div className="px-4 sm:px-6 lg:px-8 ">
                            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <thead>
                                            <tr>
                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                                    Company
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Requirements
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {referralCompanies.map((company, index) => (
                                                <tr key={company.id}>
                                                    <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                                                        <div className="flex items-center">
                                                            <div className="mr-3">
                                                                <img className="h-5 w-5 rounded-full" src={company.image} alt="" />
                                                            </div>
                                                            <div className="font-medium text-gray-900">{company.name}</div>
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap text-left px-3 py-5 text-sm text-gray-500">
                                                        <ul>
                                                            {company.referral_materials.resume &&
                                                                <li key="resume" className='flex'> {resumes.length !== 0 ?
                                                                    <CheckCircleIcon className='text-green-600 mt-1' width="15" height="15" /> :
                                                                    <XCircleIcon className='text-red-600 mt-1' width="15" height="15" />}
                                                                    Resume
                                                                </li>}
                                                            {company.referral_materials.essay &&
                                                                <li key="essay" className='flex'> {essay.length !== 0 ?
                                                                    <CheckCircleIcon className='text-green-600 mt-1' width="15" height="15" /> :
                                                                    <XCircleIcon className='text-red-600 mt-1' width="15" height="15" />}
                                                                    Essay
                                                                </li>}
                                                            {company.referral_materials.contact &&
                                                                <li key="contact" className='flex'> {contact.length !== 0 ?
                                                                    <CheckCircleIcon className='text-green-600 mt-1' width="15" height="15" /> :
                                                                    <XCircleIcon className='text-red-600 mt-1' width="15" height="15" />}
                                                                    Contact
                                                                </li>}
                                                        </ul>
                                                    </td>
                                                    <td className="whitespace-nowrap text-left px-3 py-5 text-sm text-gray-500">
                                                        {
                                                            company.referral ?
                                                                <span className={classNames(referralStatuses[company.referral.status || "None"], "inline-flex text-left rounded-full  px-2 py-1 text-xs font-medium ring-1 ring-inset ")}>
                                                                    {company.referral.status}
                                                                    {company.role}
                                                                </span>
                                                                :
                                                                <button
                                                                    className="inline-flex text-left rounded-full  px-2 py-1 text-xs font-medium ring-1 ring-inset"
                                                                    onClick={() => {
                                                                        setReferralIndex(index);
                                                                        setReferralCompanyId(company.id)
                                                                    }}>
                                                                    Request
                                                                </button>
                                                        }
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <ReferralActivity referrals={userReferralCompanies ?? []} />

                    {
                        referralCompanyId &&
                        <ReferralCreate
                            resumes={resumes}
                            company={referralCompanies[referralIndex]}
                            referralCompanyId={referralCompanyId}
                            setReferralCompanyId={setReferralCompanyId}
                            action={referralAction(null, resumes, essay, contact)} />
                    }
                </>
            }
        </>
    )
}


export default Referrals;