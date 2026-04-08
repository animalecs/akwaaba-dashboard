import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'

export function Modal({ open, onClose, title, description, children }) {
    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto px-4 py-8 sm:px-6">
                    <div className="flex min-h-full items-center justify-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-200"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-150"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
                                <div className="mb-4 flex items-start justify-between gap-4">
                                    <div>
                                        <Dialog.Title className="text-xl font-semibold text-slate-900">{title}</Dialog.Title>
                                        {description && <p className="mt-2 text-sm text-slate-600">{description}</p>}
                                    </div>
                                    <button className="rounded-2xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900" onClick={onClose}>
                                        <X size={20} />
                                    </button>
                                </div>
                                {children}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
