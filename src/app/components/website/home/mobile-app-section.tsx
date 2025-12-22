import React from 'react'
import Section from '../../shared/section'
import SubHeading from '../../shared/subHeading'
import Button from '../../shared/Button'
import mobile from '/public/assets/images/tayyranapp.png'
import appstore from '/public/assets/images/appstore.png'
import playstore from '/public/assets/images/aystore.png'
import Image from 'next/image'
import ParaHeading from '../../shared/para-heading'
import Link from 'next/link'

type Props = {
    t: (key: string) => string;
}

const MobileAppSection = (props: Props) => {
    const { t } = props;

    return (
        <div>
            <Section>
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 items-center justify-between">
                    <div className="space-y-5 lg:w-3/4">
                        <SubHeading className='!text-grayText'>{t("mobileAppSection.heading")}</SubHeading>
                        <ParaHeading className='!text-black !font-bold'>  {t("mobileAppSection.exprensHeading")} </ParaHeading>
                        <SubHeading className='!text-grayText'>{t("mobileAppSection.subHeading")}</SubHeading>
                        <Button label={t("mobileAppSection.downloadButton")} style="!bg-orange" />
                        <div className="flex gap-5 items-center">
                            <Link href="https://play.google.com/store/apps/details?id=com.tayyran.tayyran_app" className="hover:scale-105 duration-300 transition-all">
                                <Image src={playstore} alt='' className='' />
                            </Link>

                            <Link href="https://apps.apple.com/sa/app/tayyran/id6756125501" className="hover:scale-105 duration-300 transition-all">
                                <Image src={appstore} alt='' className='' />
                            </Link>
                        </div>

                    </div>
                    <Image src={mobile} alt='' className='' />

                </div>
            </Section>
        </div>
    )
}

export default MobileAppSection