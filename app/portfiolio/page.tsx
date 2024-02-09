import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default function Portfolio() {
    return (
        <Card>
            {/* Replace '/otherpage' with the actual path to your target page */}
            <Link href="/cryptoApp/mainPage">
                page
            </Link>
        </Card>
    );
}