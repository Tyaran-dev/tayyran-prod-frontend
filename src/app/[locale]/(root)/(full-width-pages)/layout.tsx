export default function FullWidthPageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div className=" min-h-[80vh] w-full  flex items-center justify-center">{children}</div>;
}