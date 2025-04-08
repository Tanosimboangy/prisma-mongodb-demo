'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import { createPost } from "@/app/actions";
import { User } from "@prisma/client"; 

interface PostFormProps {
  users: User[];
}

export default function PostForm({ users }: PostFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const handleCreatePost = async () => {
    if (!title || !authorId) {
      toast.error("Title and author are required");
      return;
    }
    
    setLoading(true);
    try {
      await createPost({
        title,
        content,
        authorId,
        published
      });
      
      // Reset form
      setTitle('');
      setContent('');
      setAuthorId('');
      setPublished(false);
      
      toast.success("Post created successfully");
      router.refresh();
      
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast.error(error.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="shadow-sm bg-white overflow-hidden border-0 pt-0 self-start">
      <CardHeader className="bg-green-50 border-b px-6 py-5 rounded-none">
        <CardTitle className="text-xl text-green-900">Create Post</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-gray-700 mb-1.5 block">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="title"
              placeholder="Enter post title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required
              className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>
          
          <div>
            <Label htmlFor="content" className="text-sm font-medium text-gray-700 mb-1.5 block">
              Content
            </Label>
            <Textarea 
              id="content"
              placeholder="Write your post content here..." 
              value={content} 
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
              rows={4}
              className="resize-none border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>
          
          <div>
            <Label htmlFor="author" className="text-sm font-medium text-gray-700 mb-1.5 block">
              Author <span className="text-red-500">*</span>
            </Label>
            <Select value={authorId} onValueChange={setAuthorId}>
              <SelectTrigger id="author" className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500 bg-white">
                <SelectValue placeholder="Select an author" />
              </SelectTrigger>
              <SelectContent>
                {users.length === 0 ? (
                  <div className="p-3 text-sm text-gray-500">No users available. Create a user first.</div>
                ) : (
                  users.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name || user.email}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="published" 
              checked={published} 
              onCheckedChange={(checked: boolean) => setPublished(checked)}
              className="text-green-600 focus:ring-green-500 h-5 w-5"
            />
            <Label htmlFor="published" className="text-sm font-medium text-gray-700 cursor-pointer">
              Publish immediately
            </Label>
          </div>
          
          <Button 
            onClick={handleCreatePost} 
            disabled={loading}
            className="w-full h-11 mt-2 bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-200"
          >
            {loading ? 'Creating...' : 'Create Post'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}