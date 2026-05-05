// "use client"

// import { Button } from "@/components/ui/button"
// import { orderDetails } from "@/constants/order"
// import { useTranslations } from "next-intl"
// import Image from "@/components/MyImage"
// import { useSelector } from "react-redux"
// import { RootState } from "@/store/store"

// const Step3 = () => {
//     const t = useTranslations("translation");
//     const cartItems = useSelector((state: RootState) => state.cart.items);

//     return (
//         <div className="flex flex-col items-center justify-center px-4 mb-10">
//             <div className="max-w-3xl w-full bg-white rounded-3xl shadow-sm p-8 md:p-16 border border-gray-100 flex flex-col items-center space-y-10">
//                 {cartItems.length === 0 ? (
//                     <div className="text-center py-10">
//                         <h2 className="text-sm font-medium text-gray-400">{t("noItemsFound")}</h2>
//                     </div>
//                 ) : (
//                     <>
//                         <div className="text-center space-y-2">
//                             <h2 className="text-2xl font-semibold text-gray-800">
//                                 {t("orderProcessed")}
//                             </h2>
//                         </div>

//                         {/* Product Thumbnails with Badges */}
//                         <div className="flex flex-wrap items-center justify-center gap-6">
//                             {cartItems.map((item: any) => (
//                                 <div key={item.id} className="relative">
//                                     <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden border border-gray-50 shadow-sm">
//                                         <Image
//                                             src={item.image}
//                                             alt="ordered item"
//                                             className="w-full h-full object-cover"
//                                             width={80}
//                                             height={96}
//                                         />
//                                     </div>
//                                     <div className="absolute -top-2 -right-2 z-30 w-6 h-6 bg-gray-800 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
//                                         {item.quantity || item.qty}
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>

//                         <div className="w-full max-w-xs space-y-4">
//                             <div className="flex justify-between items-center">
//                                 <span className="text-sm font-semibold text-gray-400">{t("orderCode")}</span>
//                                 <span className="text-sm text-gray-900">{orderDetails.code}</span>
//                             </div>

//                             <div className="flex justify-between items-center">
//                                 <span className="text-sm font-semibold text-gray-400">{t("date")}</span>
//                                 <span className="text-sm text-gray-900">{orderDetails.date}</span>
//                             </div>

//                             <div className="flex justify-between items-center">
//                                 <span className="text-sm font-semibold text-gray-400">{t("total")}</span>
//                                 <span className="text-sm text-gray-900">
//                                     ${cartItems.reduce((acc: number, item: any) => acc + (item.price * (item.quantity || item.qty)), 0).toFixed(2)}
//                                 </span>
//                             </div>

//                             <div className="flex justify-between items-center">
//                                 <span className="text-sm font-semibold text-gray-400">{t("paymentMethod")}</span>
//                                 <span className="text-sm text-gray-900">{orderDetails.paymentMethod}</span>
//                             </div>
//                         </div>

//                         <Button
//                             variant="primary"
//                             className="w-full max-w-[240px]"
//                         >
//                             {t("orderHistory")}
//                         </Button>
//                     </>
//                 )}
//             </div>
//         </div>
//     )
// }

// export default Step3