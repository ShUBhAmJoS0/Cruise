
import Event from "../model/Event.js"
import Follow from "../model/follow.js"
import User from "../model/User.js"

export const getallArtists = async(req,res)=>{
    console.log("getallarist apu hit")
    try {
        const artists = await User.findAll({where:{userType:"Artist"}})
        console.log(artists)
        res.status(200).send({data:artists,message:"sucessfully fetched all artists"})
    } catch (error) {
        res.status(500).send({message:error.message})
    }
}
export const getArtistbyid = async(req,res)=>{
    console.log("get by artist hit")
    try {
        const artistid = req.params.id
        const currentUserId=req.user.id
         const followersCount = await Follow.count({
      where: { followingId:artistid }
    });

    const followingCount = await Follow.count({
      where: { followerId: artistid }
    });

    const isFollowing = await Follow.findOne({
      where: {
        followerId: currentUserId,
        followingId: artistid
      }
    });
        console.log(artistid)
        const artist = await User.findOne({where:{id:artistid}})
        console.log(artist)
        res.status(200).send({data:{artist,followersCount,
        followingCount,
        isFollowing:!!isFollowing},message:"artist by id fetched sucessfully "})
       
    } catch (error) {
        res.status(500).send({message:error.message})
    }
}
export const getArtistgigs = async(req,res)=>{4
  console.log("gig api also hit")
    try {
        const artistId=req.params.id
        console.log(artistId)
             const artistgigs = await Event.findAll({where:{createdBy:artistId}})
             console.log(artistgigs)
                     res.status(200).send({data:artistgigs,message:"gigs fetched sucessfully"})
    } catch (error) {
           res.status(500).send({message:error.message})
    }
}
