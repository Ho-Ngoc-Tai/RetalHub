import Layout from "@/app/components/containers/main/layout";
import EditPost from "@/app/components/containers/auth/posts/EditPost";

interface EditPostPageProps {
    params: {
        id: string;
    };
}

export default function EditPostPage({ params }: EditPostPageProps) {
    return (
        <Layout>
            <EditPost postId={params.id} />
        </Layout>
    );
}
