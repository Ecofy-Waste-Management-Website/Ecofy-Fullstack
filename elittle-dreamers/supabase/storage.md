# Supabase Storage Setup

Create the following buckets in Supabase Dashboard → Storage:

1. Bucket name: "images"
   Public: true
   Allowed MIME types: image/jpeg, image/png, image/webp
   Max file size: 5MB

   Folders to create inside:
   - images/hero/
   - images/about/
   - images/services/
   - images/branches/
   - images/gallery/

Storage Policy (add in Supabase dashboard):
  - Public can read all files in "images" bucket
  - Only authenticated admins can upload/delete
