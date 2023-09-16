import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'

const Edit = () => {
    const { toast } = useToast()
    return (
        <div>
            <Button
                variant='default'
                onClick={() => {
                    toast({
                        description: 'Your message has been sent.',
                    })
                }}
            >
                Show Toast
            </Button>
        </div>
    )
}

export default Edit
