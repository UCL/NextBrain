# BrainAtlas
A brain Atlas (Project No 370)

## Raw Data
For each patient a set of images and associated data are provided
- MRI scans in 3 projections: axial, sagittal, coronal
- images of histology slices stemming from a number of different blocks (regions in the brain). Each block contains a number of image slices. Images are provided as standard and high resolution images.
- transformation matrices for moving between MRI and histology diagrams
- NUMPY arrays to map MRI region to histology blocks (and reverse)

## Transformation between MRI image projections and histology images
The BrainAtlas project allows to move between images taken from MRI scans and histology images (including stained histology images). 
In order to be able to switch between different projections and images various co-ordinate transformations need to be performed. This section describes this process in more detail. In particular:

- synchronising between MRI projections (axial, sagittal, coronal), i.e. for each given point in an image, find the corresponding points in the other projections
- synchronising between a co-ordinate in a given MRI image and a histology image, i.e. for each given point in a given MRI image find the corresponding histology image and the corresponding point within it

### Synchronising Between MRI Projections

#### Main Process

The table below lists the 3 MRI image projections and corresponding image dimensions, provided in this project. Each projection has its own folder and contains all the MRI image slices taken for that projection

|| ... || Axial || Sagittal || Coronal ||
| Dimension | 448 * 224 | 282 * 448 | 282 * 224 |
| No of slices/images | 282 | 224 | 448 | 

To synchronise we need to use a 3 dimensional co-ordinate system. The first 2 co-ordinates are given via the image dimensions (i.e. the pixels in the image). The number of images for each projection is the 3rd co-ordinate. As can be seen, the number of slices/images in each folder matches between all projections. 
With this it is possible to look at the images as projections from 3 different planes (x-y, z-x, z-y), 
where x_max, y_max and z_max describe the boundaries on each axis:

- axial      x_max = 448, y_max = 224 (slices along z-axis: z_max = 282 => number of images): [(x,y), z]
- sagittal   z_max = 282, x_max = 448 (slices along y-axis: y_max = 224 => number of images): [(z,x), y]
- coronal    z_max = 282, y_max = 224 (slices along x-axis: x_max = 448 => number of images): [(z,y), x]


##### Example:
Let's assume we show image "slice_004" (5th image) in the *axial* projection. Within that we select the following co-ordinates/pixel:
- (x = 10, y = 7)
The 3 dimensional co-ordinates of this point will then be (x = 10, y = 7, z = 4)
With that we can pick the corresponding pixels in the other 2 projections:
- Sagittal: pixel (x' = 4, y' = 10) in slice_007. Note x' (sagittal) == z (axial), z' (sagittal) == y (axial)
- Coronal: pixel (x' = 4, y' 7) in slice_010. x' (coronal) == z (axial), y' (coronal) == y (axial), z' (coronal) == x (axial)


### Synchronising between MRI and Histology images

#### From MRI to Histology
Histology images or slices are generated in a different way than MRI images. Therefore, the mapping between co-ordinates between histology and MRI images can only be approximate. Furthermore, there may not be a corresponding image for a selected pixel in an MRI image.

Histology slices (and images) are created from blocks of brain tissue. Each block is identified with a label/number and corresponds to one area in the brain.

In principle the matching of co-ordinates follows the three steps below:
- for a given pixel find the corresponding histology block. This is facilitated by a number of stored pixel arrays (stored as NUMPY arrays) in the MRI folder (see below)
- if a corresponding block is found, select the corresponding matrix 
- take the pixel co-ordinates and transform them into (x,y,z) co-ordinates for the histology images. Note, that the 3rd dimension identifies the slice number of the image

Here is a more detailed description of each step:

##### Finding the corresponding histology block
The in the images folder of the project we have 3 folders called:
- indices_axial
- indices_sagittal
- indices_coronal
Each folder contains a number of binary arrays (in NUMPY format) that are a pixel representation of each image slice for axial, sagittal, coronal projections. The number of NMPY files corresponds exactly to the number of image slices for the axial/sagittal/coronal projections. (they form the 3rd co-ordinate as mentioned above).

Example:
Let's use the same example we used for synchronising between MRI images. I.e. 
- select the 5th image in the *axial* projection, i.e. slice_004 and in there a pixel of value (x=10, y=7)
We can then find the corresponding block by:
- open slice_004.npy and read into a 2 dim array[][]
- read the array value array[10][7]
The result can be one of 2 cases
1. the value is 0. In this case, no corresponding block is available
2. the value is > 0, in which case we found a corresponding block

##### Applying the transformation of co-ordinates
Let's assume we found a corresponding block for histology, e.g. block No *26* (they are labelled from 1...45)
Transformation matrices are found in the folder
- matrices (for standard resolution histology images)
- matrices_hr (for high resolution histology images)
In our example we want to use standard resolution images. Therefore, we will pick the content of file
*block_26.txt* 
This is a 4x4 matrix, which looks like this

| 0.032133931694333664 | 3.49719831461958 | -1.972503357700436 | 40.325292337980784 |
| 1.0508095109766031 | -1.908419529278237 | -3.3734531721503673 | 548.0686819130044 |
| -0.6701068560093678 | -0.08577660617009603 | -0.16640329181257396 | 135.59958866941196 |
| 0.0 | 0.0 | 0.0 | 1.0 |

In order to perform a matrix multiplication we will need to expand the co-ordinates from (x,y,z) to (x,y,z,1).
Using the example co-ordinates from above this becomes
(x=10, y=7, z=4, 1) 
We can then perform a matrix multiplication. Let v' be the transformed vector, v the original vector with the MRI image co-ordinates and A the transformation matrix:

v' = A * v

v' is again 4 dimensional, where v' = (x', y', z', 1)

##### Picking the histology slice
Histology images are stored in the *histology* (standard resolution) and *histology_hr* folders. Each histology folder contains a directory for each image *block*, labelled with the number/id of that block. The images/slices for each block are then listed in *block* subdirectories called
*slices_HE*, *slices_LFB*, *slices_MRI*. (this depends on the selection of the user in the web page).

In short the structure is like this
*patient* -> histology -> block_number -> slices_HE...

The image and pixel in the image can then be selected given the transformed co-ordinates from above.

Example:
Assuming we want to show images from the *slices_HE* folder: 

- We keep with the example above: MRI axial image slice_004 with pixel (x=10,y=7). The co-ordinates for vector v are (10,7,4). 
- for this set of co-ordinates we found a corresponding histology block, i.e. *26*
- after applying the transformation matrix to the vector v (10,7,4) we obtain transformed co-ordinates (x', y', z')

The 3rd co-ordinate (here z'), will give the image number in the *slice_HE* folder
The transformed (x', y') co-ordinates will identify the pixels in that image

##### Which co-ordinates are the right ones?
Remember there are 3 MRI projections: axial, sagittal and coronal! They all refer to the same 3-dim brain volume co-ordinates (x,y,z). However, the order in which they are expressed is different. Assuming that axial images are slices of (x,y) along the z-axis: i.e. [(x,y), z], then we have sagittal as [(z,x) ,y] and coronal [(z,y), x].

It is probably best to use one projection as frame of reference for co-ordinate transformation between MRI and histology images. For each point in a given projection, we can compute the corresponding point in the reference projection. 

Using that in the matrix multiplications will give consistent results.

### Synchronising between Histology MRI images
The step back from a co-ordinate in the histology image to the corresponding MRI image co-ordinate follows the steps from above in reverse.
However, the data for histology are organised in different ways, part of which was mentioned above.

- there are 3 types of histology images (slices_HE, slices_LFB, slices_MRI) in each histology *block* folder
- the *block* folder also holds a matrix.txt file, which is the inverse matrix to the one shown in the paragraph above

The co-ordinate transformation would then follow these steps:
- construct the co-ordinate vector *v* from the pixel (x,y) and the index of the slice/image in the list of images. As before, the vector needs to be of form (x,y,z,1)
- open the matrix.txt file and read in the values into a 4 x 4 transformation matrix A  (2-dim array)
- use matrix multiplication to get the transformed co-ordinates *v'* = A * v. 
- this transformed vector v' will give the co-ordinates in the image of the reference projection (e.g. axial)
- use the co-ordinates for the reference projection to sync with the other 2 MRI projections







