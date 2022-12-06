//
//  detail.swift
//  tmp
//
//  Created by Jianlgi on 11/28/22.
//

import SwiftUI
import MapKit
import Combine

struct BusinessInfo : View {
    @Binding var info: JSON?
    @State var isShwoingReservation = false
    @State var cancelReservation = false
    @State var showingImage = 0
    @AppStorage("Reservations") var reservations: String = "";
    var body: some View {
        ScrollView{
            Text(info?["name"].stringValue ?? "Loading").bold().font(.system(size: 40)).padding(10)
            VStack{
                HStack{
                    Text("Address").bold()
                    Spacer()
                    Text("Category").bold()
                }
                HStack{
                    Text(get_address(info: info ?? JSON())).foregroundColor(.gray)
                    Spacer()
                    Text(get_cat(info: info ?? JSON() )).foregroundColor(.gray)
                }
                HStack{}.padding(2)
                HStack{
                    Text("Phone").bold()
                    Spacer()
                    Text("Price Range").bold()
                }
                HStack{
                    Text(info?["display_phone"].stringValue ?? "Loading").foregroundColor(.gray)
                    Spacer()
                    Text(info?["price"].stringValue ?? "$").foregroundColor(.gray)
                }
                HStack{}.padding(2)
                HStack{
                    Text("Status").bold()
                    Spacer()
                    Text("Visit Yelp for more").bold()
                }
                HStack{
                    if info?["hours"][0]["is_open_now"].bool! ?? false {
                        Text("Open Now").foregroundColor(.green)
                    } else {
                        Text("Closed").foregroundColor(.red)
                    }
                    Spacer()
                    Link("Business Link", destination: URL(string: info?["url"].string! ?? "https://yelp.com")!)
                }
                VStack(spacing: 0){
                    HStack{}.padding(2)
                    if has_reservation(id: info?["id"].string! ?? ""){
                        Button(action: {
                            del_reservation(id: info?["id"].string! ?? "loading")
                            cancelReservation = true
                        }, label: {
                            Text("Cancel Reservation").padding(10)
                        }).buttonStyle(BorderlessButtonStyle()).foregroundColor(.white).background(.blue).clipShape(RoundedRectangle(cornerRadius: 6, style: .continuous))
                    } else {
                        Button(action: {
                            isShwoingReservation = true
                        }) {
                            Text("Reserve Now").padding(10)
                        }.buttonStyle(BorderlessButtonStyle()).foregroundColor(.white).background(.red).clipShape(RoundedRectangle(cornerRadius: 6, style: .continuous))
                            
                    }
                    HStack{}.padding(2).popover(isPresented: $isShwoingReservation) {
                        ReservationForm(business: $info, showing: $isShwoingReservation)
                    }
                    HStack{
                        Text("Shear on: ").bold()
                        Link(destination: URL(
                                string: get_twitter_url(name: info?["name"].string! ?? "this", url: info?["url"].string! ?? "https://yelp.com")
                            )!,
                             label: {
                                Image("twitter").resizable().scaledToFit().frame(width: 40, height: 40)
                        })
                        Link(destination: URL(string:
                                get_facebook_url(name: info?["name"].string! ?? "this", url: info?["url"].string! ?? "https://yelp.com")
                            )!, label: {Image("facebook").resizable().scaledToFit().frame(width: 40, height: 40)})
                    }.padding(.vertical, 20)
                    
                    TabView(selection: $showingImage){
                        AsyncImage(url: URL(string: info?["photos"][0].string! ?? "http://example.com")){ image in
                            image.resizable()
                        } placeholder: {
                            ProgressView()
                        }.frame(width: 300, height: 300).tag(0).highPriorityGesture(DragGesture().onEnded({ self.handleSwipe(translation: $0.translation.width)}))
                        AsyncImage(url: URL(string: info?["photos"][1].string! ?? "http://example.com")){ image in
                            image.resizable()
                        } placeholder: {
                            ProgressView()
                        }.frame(width: 300, height: 300).tag(1).highPriorityGesture(DragGesture().onEnded({ self.handleSwipe(translation: $0.translation.width)}))
                        AsyncImage(url: URL(string: info?["photos"][2].string! ?? "http://example.com")){ image in
                            image.resizable()
                        } placeholder: {
                            ProgressView()
                        }.frame(width: 300, height: 300).tag(2).highPriorityGesture(DragGesture().onEnded({ self.handleSwipe(translation: $0.translation.width)}))
                    }.frame(height: UIScreen.main.bounds.width / 1.475)
                        .padding(.vertical, 20)
                }
            }
        }.toast(isShowing: $cancelReservation, text: Text("Reservation canceled").foregroundColor(.red))
    }
    func handleSwipe(translation: CGFloat) {
        if translation > 0 {
            showingImage += 1
        } else {
            showingImage -= 1
        }
        showingImage = (showingImage + 3) % 3
    }
    func get_cat(info: JSON) -> String {
        var ret = ""
        for (index,subJson):(String, JSON) in info["categories"] {
            if index != "0" {
                ret = ret + " | "
            }
            ret = ret + subJson["title"].string!
        }
        return ret
    }
    
    func get_address(info: JSON) -> String{
        var ret = ""
        for (index,subJson):(String, JSON) in info["location"]["display_address"] {
            if index != "0"{
                ret = ret + " "
            }
            ret = ret + subJson.string!
        }
        return ret
    }
    
    func get_twitter_url(name: String, url: String) -> String{
        var ret = "http://twitter.com/share?text=";
        ret = ret + ("Check " + name + " on yelp").addingPercentEncoding(withAllowedCharacters: .urlHostAllowed)!
        ret = ret + "&url=" + url.addingPercentEncoding(withAllowedCharacters: .urlHostAllowed)!
        return ret
    }
    func get_facebook_url(name: String, url: String) -> String{
        var ret = "https://www.facebook.com/sharer/sharer.php?u=";
        ret = ret + url.addingPercentEncoding(withAllowedCharacters: .urlHostAllowed)!
        print(ret)
        return ret
    }
    
    func has_reservation(id: String) -> Bool {
        for line in reservations.components(separatedBy: "\n"){
            let r_id = line.components(separatedBy: "|")[0]
            if r_id == id {
                return true
            }
        }
        return false
    }
    
    func del_reservation(id: String) {
        let ret = "";
        for line in reservations.components(separatedBy: "\n"){
            let r_id = line.components(separatedBy: "|")[0]
            if r_id == id {
                continue
            }
        }
        reservations = ret;
    }
}

// credit: https://developer.apple.com/documentation/mapkit/mapmarker
struct IdentifiablePlace: Identifiable {
    let id: UUID
    let location: CLLocationCoordinate2D
    init(id: UUID = UUID(), lat: Double, long: Double) {
        self.id = id
        self.location = CLLocationCoordinate2D(
            latitude: lat,
            longitude: long)
    }
}


struct MapView: View{
    @Binding var business: JSON?
    @Binding var place: IdentifiablePlace
    @Binding var region: MKCoordinateRegion
      
      var body: some View {
          Map(coordinateRegion: $region, annotationItems: [place]) { place in
              MapMarker(coordinate: place.location,
                     tint: Color.red)
          }
      }

}

struct Review: Hashable{
    var user: String
    var rating: Int
    var time: String
    var text: String
}

struct Reviews: View{
    @Binding var business: JSON?
    @State var reviews: [Review] = [];
    var body: some View {
      Form{
          List{
              ForEach(reviews, id: \.self) { review in
                  VStack{
                      HStack{
                          Text(review.user).bold()
                          Spacer()
                          Text(review.rating.formatted() + "/5").bold()
                      }.padding(5)
                      Text(review.text).foregroundColor(.gray)
                      HStack{
                          Spacer()
                          Text(review.time)
                          Spacer()
                      }.padding(5)
                  }
              }
          }
      }.onAppear(perform: fetch_review)
    }
    func fetch_review() {
        reviews.removeAll()
        guard let url = URL(string: "https://hw8-nodejs-runtime.uw.r.appspot.com/reviews/" + self.business!["id"].string!)
            else {
                print("Invalid URL")
                return
            }
            let request = URLRequest(url: url)
            URLSession.shared.dataTask(with: request) { data, response, error in
                if let data = data {
                    let json = try?JSON(data: data)
                    for (_, subJson):(String, JSON) in json!["reviews"] {
                        reviews.append(Review(
                            user: subJson["user"]["name"].string!,
                            rating: subJson["rating"].int!,
                            time: subJson["time_created"].string!.components(separatedBy: " ")[0],
                            text: subJson["text"].string!
                        ))
                    }
                }
            }.resume()
    }
}


struct BusinessDetail: View {
    @Binding var business: Business?
    @State var detail: JSON?
    @State var showNext = true;
    @State var selectedTab = 0;
    @State var place: IdentifiablePlace = IdentifiablePlace(lat: 37.334_900, long: -122.009_020)
    @State var region = MKCoordinateRegion(
          center: CLLocationCoordinate2D(latitude: 37.334_900,
                                         longitude: -122.009_020),
          latitudinalMeters: 750,
          longitudinalMeters: 750
      )
    
    var body: some View {
            NavigationView {
                TabView(selection: $selectedTab, content: {
                    BusinessInfo(info: $detail).tabItem{
                        Label("Business Detail", systemImage: "text.bubble.fill")
                    }
                    MapView(business: $detail, place: $place, region: $region).tabItem {
                        Label("Map Location", systemImage: "location.fill")
                    }
                    Reviews(business: $detail).tabItem{
                        Label("Reviews", systemImage: "message.fill")
                        
                    }
                   })
                }.onAppear(perform: fetch_detail)
        }

    func fetch_detail() {
        guard let url = URL(string: "https://hw8-nodejs-runtime.uw.r.appspot.com/details/" + self.business!.id)
            else {
                print("Invalid URL")
                return
            }
            let request = URLRequest(url: url)

            URLSession.shared.dataTask(with: request) { data, response, error in
                if let data = data {
                    let json = try?JSON(data: data)
                    detail = json
                }
                set_region()
            }.resume()
    }
    
    func set_region() {
        region.center.latitude = detail?["coordinates"]["latitude"].doubleValue ?? 37.334_900
        region.center.longitude = detail?["coordinates"]["longitude"].doubleValue ?? -122.009_020
        
        place = IdentifiablePlace(lat: region.center.latitude, long: region.center.longitude)
    }
    
}

struct detail_Preview: View {
    @State var b:Business? = Business(index: 0, img: "placeholder", Name: "1", id: "8mOvyL1Xzv2voG54DEBNog")
    var body: some View {
        BusinessDetail(business: $b)
    }
}

struct detail_Previews: PreviewProvider {
 
    static var previews: some View {
        detail_Preview()
    }
}


struct ReservationForm: View {
    @Binding var business: JSON?
    @Binding var showing: Bool;
    @State var email: String = ""
    @State var server = DateServer();
    @State var hour = 10;
    @State var minute = "00";
    @State var toast = false;
    @State var success = false;
    @AppStorage("Reservations") var reservations: String = "";
    var body: some View{
        Form{
            Section{
                HStack{
                    Spacer()
                    Text("Reservation Form").bold().font(.system(size: 35))
                    Spacer()
                }
            }
            Section{
                HStack{
                    Spacer()
                    Text(business?["name"].stringValue ?? "Loading").bold().font(.system(size: 35))
                    Spacer()
                }
            }
            Section{
                HStack{
                    Text("Email:").foregroundColor(.gray)
                    TextField(text: $email) {}
                }
                HStack{
                    Text("Date/Time:").foregroundColor(.gray)
                    DatePicker(
                        selection: $server.date,
                        in: Date()...,
//                        minimumDate: Calendar.current.date(),
                        displayedComponents: .date, label: {Text("")}
                    )
                    HStack{
                        HStack{
                            Menu {
                                ForEach(10..<18) { v in
                                    Button(action: {hour = v}) {
                                        Text(v.formatted()).foregroundColor(.black)
                                    }
                                }
                            } label: {
                                Text(hour.formatted()).foregroundColor(.black)
                            }
                            Text(":").foregroundColor(.gray)
                            Menu{
                                Button(action: {minute = "00"}){Text("00")}
                                Button(action: {minute = "15"}){Text("15")}
                                Button(action: {minute = "30"}){Text("30")}
                                Button(action: {minute = "45"}){Text("45")}
                            } label: {
                                Text(minute).foregroundColor(.black)
                            }.pickerStyle(MenuPickerStyle())
                        }.padding(7)
                    }.background(Color(.systemGray6)).clipShape(RoundedRectangle(cornerRadius: 8))
                }
                HStack{
                    Spacer()
                    Button {
                        on_submit()
                    } label: {
                        Text("Submit").foregroundColor(.white).padding(10)
                    }.background(.blue).clipShape(RoundedRectangle(cornerRadius: 6, style: .continuous)).buttonStyle(BorderlessButtonStyle())
                        .popover(isPresented: $success) {
                            ZStack{
                                Color.green.ignoresSafeArea()
                                VStack{
                                    Spacer()
                                    Text("Congratulations!").foregroundColor(.white).bold().padding(5)
                                    Text("You have successfully made an reservation at " + (business?["name"].stringValue ?? "loading")).foregroundColor(.white)
                                    Spacer()
                                    Button(action: {done()}) {
                                        Text("Done").padding(10)
                                    }.foregroundColor(.green).background(.white).clipShape(RoundedRectangle(cornerRadius: 10)).buttonStyle(BorderlessButtonStyle())
                                }
                            }
                        }
                    Spacer()
                }
            }
        }.toast(isShowing: $toast, text: Text("Please enter a valid email."))
    }
    
    func on_submit() {
        if !isValidEmail(email){
            toast = true
            return
        }
        var rev:String = "";
        if reservations.count > 0 {
            reservations = reservations + "\n"
        }
        rev = (business?["id"].stringValue ?? "") + "|"
        rev = rev + (business?["name"].stringValue ?? "") + "|"
        rev = rev + server.date.formatted() + "|"
        rev = rev + hour.formatted() + ":" + minute + "|" + email;
        reservations = reservations + rev
        success = true
    }
    
    func isValidEmail(_ email: String) -> Bool {
        let emailRegEx = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"

        let emailPred = NSPredicate(format:"SELF MATCHES %@", emailRegEx)
        return emailPred.evaluate(with: email)
    }
    
    func done() {
        success = false
        showing = false
    }
}

class DateServer: ObservableObject {
    var didChange = PassthroughSubject<DateServer, Never>()
    var date: Date = Date() {
        didSet {
            didChange.send(self)
        }
    }
}


struct Toast<Presenting>: View where Presenting: View {

    /// The binding that decides the appropriate drawing in the body.
    @Binding var isShowing: Bool
    /// The view that will be "presenting" this toast
    let presenting: () -> Presenting
    /// The text to show
    let text: Text

    var body: some View {

        GeometryReader { geometry in

            ZStack(alignment: .center) {

                self.presenting()
                    .blur(radius: self.isShowing ? 1 : 0)
                VStack{
                    Spacer()
                    VStack {
                        self.text
                    }
                    .frame(width: geometry.size.width / 1.5,
                           height: geometry.size.height / 7)
                    .background(Color.secondary.colorInvert())
                    .foregroundColor(Color.primary)
                    .cornerRadius(20)
                    .transition(.slide)
                    .onAppear {
                        DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                            withAnimation {
                                self.isShowing = false
                            }
                        }
                    }
                    .opacity(self.isShowing ? 1 : 0)
                }
            }

        }.onTapGesture(perform: {
            DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
              withAnimation {
                self.isShowing = false
              }
            }
        })

    }

}

extension View {

    func toast(isShowing: Binding<Bool>, text: Text) -> some View {
        Toast(isShowing: isShowing,
              presenting: { self },
              text: text)
    }

}
