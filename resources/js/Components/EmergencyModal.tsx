import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function EmergencyModal({ open, setOpen }: Props) {
    const emergencyContacts = [
        { name: 'الإسعاف', number: '110', icon: '🚑', color: 'bg-red-500' },
        { name: 'الإطفاء', number: '113', icon: '🚒', color: 'bg-orange-500' },
        { name: 'الشرطة', number: '112', icon: '🚓', color: 'bg-blue-600' },
    ];

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={setOpen} dir="rtl">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white px-4 pb-4 pt-5 text-right shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                                <div>
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                                        <span className="text-4xl">🚨</span>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-5">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-xl font-bold leading-6 text-slate-900"
                                        >
                                            أرقام الطوارئ
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <p className="text-sm text-slate-500">
                                                اضغط على الرقم للاتصال مباشرة
                                            </p>
                                        </div>

                                        <div className="mt-6 flex flex-col gap-3">
                                            {emergencyContacts.map((contact) => (
                                                <a
                                                    key={contact.name}
                                                    href={`tel:${contact.number}`}
                                                    className={`hover:scale-102 flex w-full items-center justify-between rounded-xl border border-slate-100 p-4 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md active:scale-95`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div
                                                            className={`flex h-12 w-12 items-center justify-center rounded-full text-white shadow-md ${contact.color}`}
                                                        >
                                                            <span className="text-2xl">
                                                                {contact.icon}
                                                            </span>
                                                        </div>
                                                        <span className="text-lg font-bold text-slate-900">
                                                            {contact.name}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1 font-mono text-xl font-bold tracking-widest text-slate-600">
                                                        {contact.number}
                                                        <span className="text-lg">
                                                            📞
                                                        </span>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 sm:mt-8">
                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center rounded-xl bg-slate-100 px-3 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
                                        onClick={() => setOpen(false)}
                                    >
                                        إغلاق
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
